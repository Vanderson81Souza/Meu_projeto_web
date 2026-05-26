import sqlite3
from flask import Flask, jsonify, request, g, abort
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "vet_clinic.db"
app = Flask(__name__, static_folder='.', static_url_path='')


def get_db():
    db = getattr(g, "db", None)
    if db is None:
        db = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        db.row_factory = sqlite3.Row
        g.db = db
    return db


@app.teardown_appcontext
def close_db(exc=None):
    db = getattr(g, "db", None)
    if db is not None:
        db.close()


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS animals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                especie TEXT,
                raca TEXT,
                idade INTEGER,
                dono TEXT,
                contatoDono TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                tipo TEXT,
                data TEXT,
                valor REAL,
                vet TEXT,
                FOREIGN KEY(animal_id) REFERENCES animals(id) ON DELETE CASCADE
            )
            """
        )
        conn.commit()


def row_to_dict(row):
    if row is None:
        return None
    return {k: row[k] for k in row.keys()}


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response


@app.route("/")
def index():
    return app.send_static_file('index.html')


@app.route("/api/animals", methods=["GET", "POST"])
def animals_collection():
    db = get_db()
    if request.method == "GET":
        rows = db.execute("SELECT * FROM animals ORDER BY id DESC").fetchall()
        return jsonify([row_to_dict(row) for row in rows])

    payload = request.get_json() or {}
    required = ["nome", "especie", "dono"]
    if not all(payload.get(field) for field in required):
        return jsonify({"error": "Os campos nome, especie e dono são obrigatórios."}), 400

    cursor = db.execute(
        "INSERT INTO animals (nome, especie, raca, idade, dono, contatoDono) VALUES (?, ?, ?, ?, ?, ?)",
        (
            payload.get("nome"),
            payload.get("especie"),
            payload.get("raca"),
            payload.get("idade"),
            payload.get("dono"),
            payload.get("contatoDono"),
        ),
    )
    db.commit()
    animal_id = cursor.lastrowid
    animal = db.execute("SELECT * FROM animals WHERE id = ?", (animal_id,)).fetchone()
    return jsonify(row_to_dict(animal)), 201


@app.route("/api/animals/<int:animal_id>", methods=["GET", "PUT", "DELETE"])
def animal_item(animal_id):
    db = get_db()
    animal = db.execute("SELECT * FROM animals WHERE id = ?", (animal_id,)).fetchone()
    if animal is None:
        abort(404)

    if request.method == "GET":
        return jsonify(row_to_dict(animal))

    if request.method == "PUT":
        payload = request.get_json() or {}
        db.execute(
            "UPDATE animals SET nome = ?, especie = ?, raca = ?, idade = ?, dono = ?, contatoDono = ? WHERE id = ?",
            (
                payload.get("nome", animal["nome"]),
                payload.get("especie", animal["especie"]),
                payload.get("raca", animal["raca"]),
                payload.get("idade", animal["idade"]),
                payload.get("dono", animal["dono"]),
                payload.get("contatoDono", animal["contatoDono"]),
                animal_id,
            ),
        )
        db.commit()
        updated = db.execute("SELECT * FROM animals WHERE id = ?", (animal_id,)).fetchone()
        return jsonify(row_to_dict(updated))

    db.execute("DELETE FROM animals WHERE id = ?", (animal_id,))
    db.commit()
    return jsonify({"deleted": animal_id})


@app.route("/api/services", methods=["GET", "POST"])
def services_collection():
    db = get_db()
    if request.method == "GET":
        sql = "SELECT s.*, a.nome AS animal_nome, a.especie AS animal_especie, a.raca AS animal_raca, a.idade AS animal_idade, a.dono AS animal_dono, a.contatoDono AS animal_contatoDono FROM services s JOIN animals a ON s.animal_id = a.id"
        filters = []
        params = []
        animal_id = request.args.get("animal_id")
        vet = request.args.get("vet")
        month = request.args.get("month")

        if animal_id:
            filters.append("s.animal_id = ?")
            params.append(animal_id)
        if vet:
            filters.append("s.vet = ?")
            params.append(vet)
        if month:
            filters.append("s.data LIKE ?")
            params.append(f"{month}%")

        if filters:
            sql += " WHERE " + " AND ".join(filters)

        sql += " ORDER BY s.data DESC"
        rows = db.execute(sql, params).fetchall()
        result = []
        for row in rows:
            record = row_to_dict(row)
            record["animal"] = {
                "id": row["animal_id"],
                "nome": row["animal_nome"],
                "especie": row["animal_especie"],
                "raca": row["animal_raca"],
                "idade": row["animal_idade"],
                "dono": row["animal_dono"],
                "contatoDono": row["animal_contatoDono"],
            }
            result.append(record)
        return jsonify(result)

    payload = request.get_json() or {}
    animal_id = payload.get("animal_id")
    if animal_id is None:
        return jsonify({"error": "animal_id é obrigatório."}), 400

    animal_exists = db.execute("SELECT 1 FROM animals WHERE id = ?", (animal_id,)).fetchone()
    if animal_exists is None:
        return jsonify({"error": "Animal não encontrado."}), 404

    cursor = db.execute(
        "INSERT INTO services (animal_id, tipo, data, valor, vet) VALUES (?, ?, ?, ?, ?)",
        (
            animal_id,
            payload.get("tipo"),
            payload.get("data"),
            payload.get("valor"),
            payload.get("vet"),
        ),
    )
    db.commit()
    service_id = cursor.lastrowid
    service = db.execute("SELECT * FROM services WHERE id = ?", (service_id,)).fetchone()
    return jsonify(row_to_dict(service)), 201


@app.route("/api/services/<int:service_id>", methods=["GET", "PUT", "DELETE"])
def service_item(service_id):
    db = get_db()
    service = db.execute("SELECT * FROM services WHERE id = ?", (service_id,)).fetchone()
    if service is None:
        abort(404)

    if request.method == "GET":
        return jsonify(row_to_dict(service))

    if request.method == "PUT":
        payload = request.get_json() or {}
        animal_id = payload.get("animal_id", service["animal_id"])
        if animal_id is not None:
            animal_exists = db.execute("SELECT 1 FROM animals WHERE id = ?", (animal_id,)).fetchone()
            if animal_exists is None:
                return jsonify({"error": "Animal não encontrado."}), 404

        db.execute(
            "UPDATE services SET animal_id = ?, tipo = ?, data = ?, valor = ?, vet = ? WHERE id = ?",
            (
                animal_id,
                payload.get("tipo", service["tipo"]),
                payload.get("data", service["data"]),
                payload.get("valor", service["valor"]),
                payload.get("vet", service["vet"]),
                service_id,
            ),
        )
        db.commit()
        updated = db.execute("SELECT * FROM services WHERE id = ?", (service_id,)).fetchone()
        return jsonify(row_to_dict(updated))

    db.execute("DELETE FROM services WHERE id = ?", (service_id,))
    db.commit()
    return jsonify({"deleted": service_id})


@app.route("/api/history", methods=["GET"])
def history_collection():
    return services_collection()


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
