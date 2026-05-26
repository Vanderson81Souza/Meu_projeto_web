// ========================= LOGIN =========================
function fazerLogin() {

    let usuario =
        document.getElementById("usuario").value;

    let senha =
        document.getElementById("senha").value;

    let mensagem =
        document.getElementById("mensagem");

    if (usuario === "lele" && senha === "1981") {

        mensagem.style.color = "green";

        mensagem.innerHTML =
            "Login realizado com sucesso!";

    } else {

        mensagem.style.color = "red";

        mensagem.innerHTML =
            "Usuário ou senha inválidos";
    }
}

// ========================= STORAGE ANIMAIS =========================
function obterAnimais() {

    return JSON.parse(
        localStorage.getItem("animaisVeterinaria")
    ) || [];
}

function salvarAnimal(animal) {

    const animais = obterAnimais();

    animais.push(animal);

    localStorage.setItem(
        "animaisVeterinaria",
        JSON.stringify(animais)
    );
}

// ========================= STORAGE SERVIÇOS =========================
function obterServicos() {

    return JSON.parse(
        localStorage.getItem("servicosVeterinaria")
    ) || [];
}

function salvarServico(servico) {

    const servicos = obterServicos();

    servicos.push(servico);

    localStorage.setItem(
        "servicosVeterinaria",
        JSON.stringify(servicos)
    );
}

// ========================= HISTÓRICO =========================
function carregarHistorico() {

    const conteudo =
        document.getElementById("conteudo");

    conteudo.innerHTML = `

        <div class="historico-container">

            <div class="filtros-historico">

                <div>
                    <label>Veterinário:</label>

                    <select id="filtroVet">

                        <option value="">
                            Todos
                        </option>

                        <option>Dr. Silva</option>
                        <option>Dra. Costa</option>
                        <option>Dr. Almeida</option>
                        <option>Dra. Santos</option>
                        <option>Dr. Oliveira</option>

                    </select>
                </div>

                <div>
                    <label>Mês:</label>

                    <input
                        type="month"
                        id="filtroMes"
                    >
                </div>

                <button id="btnFiltrar">
                    Filtrar
                </button>

            </div>

            <br>

            <div id="resultadoHistorico"></div>

        </div>
    `;

    function renderizarHistorico() {

        let servicos = obterServicos();

        const filtroVet =
            document.getElementById("filtroVet").value;

        const filtroMes =
            document.getElementById("filtroMes").value;

        if (filtroVet !== "") {

            servicos = servicos.filter(
                s => s.vet === filtroVet
            );
        }

        if (filtroMes !== "") {

            servicos = servicos.filter(
                s => s.data.startsWith(filtroMes)
            );
        }

        const resultado =
            document.getElementById(
                "resultadoHistorico"
            );

        if (servicos.length === 0) {

            resultado.innerHTML =
                "<p>Nenhum registro encontrado.</p>";

            return;
        }

        let html = "";

        servicos.forEach(servico => {

            html += `

                <div class="resultado-area">

                    <h3>
                        ${servico.tipo}
                    </h3>

                    <br>

                    <p>
                        <strong>Data:</strong>
                        ${servico.data}
                    </p>

                    <p>
                        <strong>Veterinário:</strong>
                        ${servico.vet}
                    </p>

                    <p>
                        <strong>Valor:</strong>
                        R$ ${servico.valor}
                    </p>

                    <hr>

                    <h4>
                        Dados do Animal
                    </h4>

                    <p>
                        <strong>Nome:</strong>
                        ${servico.animal.nome}
                    </p>

                    <p>
                        <strong>Espécie:</strong>
                        ${servico.animal.especie}
                    </p>

                    <p>
                        <strong>Raça:</strong>
                        ${servico.animal.raca}
                    </p>

                    <p>
                        <strong>Idade:</strong>
                        ${servico.animal.idade}
                    </p>

                    <p>
                        <strong>Dono:</strong>
                        ${servico.animal.dono}
                    </p>

                    <p>
                        <strong>Contato:</strong>
                        ${servico.animal.contatoDono}
                    </p>

                </div>

                <br>
            `;
        });

        resultado.innerHTML = html;
    }

    renderizarHistorico();

    document
        .getElementById("btnFiltrar")
        .addEventListener(
            "click",
            renderizarHistorico
        );
}

// ========================= NAVEGAÇÃO =========================
function configurarCards() {

    const cards =
        document.querySelectorAll(".card");

    const conteudo =
        document.getElementById("conteudo");

    cards.forEach(card => {

        card.addEventListener("click", () => {

            const section =
                card.getAttribute("data-section");

            switch (section) {

                // ========================= SERVIÇOS =========================
                case "clientes":

                    const animais = obterAnimais();

                    conteudo.innerHTML = `

                        <div class="cadastro-container">

                            <div class="form-area">

                                <form id="formServicos">

                                    <label>
                                        Nome do Animal:
                                    </label>

                                    <select
                                        id="animalServico"
                                        required
                                    >

                                        <option value="">
                                            Selecione...
                                        </option>

                                        ${animais.map(animal => `
                                            <option value="${animal.nome}">
                                                ${animal.nome}
                                            </option>
                                        `).join("")}

                                    </select>

                                    <label>Serviço:</label>

                                    <select
                                        id="tipoServico"
                                        required
                                    >

                                        <option value="">
                                            Selecione...
                                        </option>

                                        <option>
                                            Consulta
                                        </option>

                                        <option>
                                            Vacina
                                        </option>

                                        <option>
                                            Emergência
                                        </option>

                                        <option>
                                            Internação
                                        </option>

                                        <option>
                                            Exames
                                        </option>

                                    </select>

                                    <label>Data:</label>

                                    <input
                                        type="date"
                                        id="dataServico"
                                        required
                                    >

                                    <label>Valor:</label>

                                    <input
                                        type="number"
                                        id="valorServico"
                                        required
                                    >

                                    <label>
                                        Veterinário:
                                    </label>

                                    <select
                                        id="vetServico"
                                        required
                                    >

                                        <option>
                                            Dr. Silva
                                        </option>

                                        <option>
                                            Dra. Costa
                                        </option>

                                        <option>
                                            Dr. Almeida
                                        </option>

                                        <option>
                                            Dra. Santos
                                        </option>

                                        <option>
                                            Dr. Oliveira
                                        </option>

                                    </select>

                                    <button type="submit">
                                        Registrar Serviço
                                    </button>

                                </form>

                            </div>

                            <div
                                class="resultado-area"
                                id="resultadoServicos"
                            ></div>

                        </div>
                    `;

                    document
                        .getElementById("formServicos")
                        .addEventListener(
                            "submit",
                            function(event){

                                event.preventDefault();

                                const nomeAnimal =
                                    document.getElementById(
                                        "animalServico"
                                    ).value;

                                const tipo =
                                    document.getElementById(
                                        "tipoServico"
                                    ).value;

                                const data =
                                    document.getElementById(
                                        "dataServico"
                                    ).value;

                                const valor =
                                    document.getElementById(
                                        "valorServico"
                                    ).value;

                                const vet =
                                    document.getElementById(
                                        "vetServico"
                                    ).value;

                                const animalSelecionado =
                                    animais.find(
                                        animal =>
                                        animal.nome === nomeAnimal
                                    );

                                const novoServico = {

                                    animal:
                                        animalSelecionado,

                                    tipo,
                                    data,
                                    valor,
                                    vet
                                };

                                salvarServico(
                                    novoServico
                                );

                                document.getElementById(
                                    "resultadoServicos"
                                ).innerHTML = `

                                    <h3>
                                        Serviço registrado!
                                    </h3>

                                    <br>

                                    <p>
                                        <strong>Animal:</strong>
                                        ${animalSelecionado.nome}
                                    </p>

                                    <p>
                                        <strong>Serviço:</strong>
                                        ${tipo}
                                    </p>

                                    <p>
                                        <strong>Data:</strong>
                                        ${data}
                                    </p>

                                    <p>
                                        <strong>Valor:</strong>
                                        R$ ${valor}
                                    </p>

                                    <p>
                                        <strong>Veterinário:</strong>
                                        ${vet}
                                    </p>
                                `;

                                document
                                    .getElementById(
                                        "formServicos"
                                    )
                                    .reset();

                            }
                        );

                    break;

                // ========================= ANIMAIS =========================
                case "animais":

                    conteudo.innerHTML = `

                        <div class="cadastro-container">

                            <div class="form-area">

                                <form id="formAnimais">

                                    <label>
                                        Nome do Animal:
                                    </label>

                                    <input
                                        type="text"
                                        id="nome"
                                        required
                                    >

                                    <label>
                                        Espécie:
                                    </label>

                                    <input
                                        type="text"
                                        id="especie"
                                        required
                                    >

                                    <label>
                                        Raça:
                                    </label>

                                    <input
                                        type="text"
                                        id="raca"
                                    >

                                    <label>
                                        Idade:
                                    </label>

                                    <input
                                        type="number"
                                        id="idade"
                                    >

                                    <label>
                                        Dono:
                                    </label>

                                    <input
                                        type="text"
                                        id="dono"
                                        required
                                    >

                                    <label>
                                        Contato do Dono:
                                    </label>

                                    <input
                                        type="text"
                                        id="contatoDono"
                                    >

                                    <button type="submit">
                                        Cadastrar
                                    </button>

                                </form>

                            </div>

                            <div
                                class="resultado-area"
                                id="resultado"
                            ></div>

                        </div>
                    `;

                    document
                        .getElementById("formAnimais")
                        .addEventListener(
                            "submit",
                            function(event){

                                event.preventDefault();

                                const animal = {

                                    nome:
                                        document.getElementById(
                                            "nome"
                                        ).value,

                                    especie:
                                        document.getElementById(
                                            "especie"
                                        ).value,

                                    raca:
                                        document.getElementById(
                                            "raca"
                                        ).value,

                                    idade:
                                        document.getElementById(
                                            "idade"
                                        ).value,

                                    dono:
                                        document.getElementById(
                                            "dono"
                                        ).value,

                                    contatoDono:
                                        document.getElementById(
                                            "contatoDono"
                                        ).value
                                };

                                salvarAnimal(animal);

                                document.getElementById(
                                    "resultado"
                                ).innerHTML = `

                                    <h3>
                                        Animal cadastrado!
                                    </h3>

                                    <br>

                                    <p>
                                        <strong>Nome:</strong>
                                        ${animal.nome}
                                    </p>

                                    <p>
                                        <strong>Espécie:</strong>
                                        ${animal.especie}
                                    </p>

                                    <p>
                                        <strong>Raça:</strong>
                                        ${animal.raca}
                                    </p>

                                    <p>
                                        <strong>Idade:</strong>
                                        ${animal.idade}
                                    </p>

                                    <p>
                                        <strong>Dono:</strong>
                                        ${animal.dono}
                                    </p>

                                    <p>
                                        <strong>Contato:</strong>
                                        ${animal.contatoDono}
                                    </p>
                                `;

                                document
                                    .getElementById(
                                        "formAnimais"
                                    )
                                    .reset();
                            }
                        );

                    break;

                // ========================= HISTÓRICO =========================
                case "historico":

                    carregarHistorico();

                    break;

                // ========================= FINANCEIRO =========================
                case "financeiro":

                    const servicos =
                        obterServicos();

                    let total = 0;

                    servicos.forEach(servico => {

                        total += Number(
                            servico.valor
                        );
                    });

                    conteudo.innerHTML = `

                        <div>

                            <h2>
                                Controle Financeiro
                            </h2>

                            <br>

                            <h3>
                                Total faturado:
                                R$ ${total.toFixed(2)}
                            </h3>

                            <br>

                            <table
                                class="tabela-financeiro"
                            >

                                <tr>
                                    <th>Data</th>
                                    <th>Serviço</th>
                                    <th>Animal</th>
                                    <th>Valor</th>
                                </tr>

                                ${servicos.map(servico => `

                                    <tr>

                                        <td>
                                            ${servico.data}
                                        </td>

                                        <td>
                                            ${servico.tipo}
                                        </td>

                                        <td>
                                            ${servico.animal.nome}
                                        </td>

                                        <td>
                                            R$ ${servico.valor}
                                        </td>

                                    </tr>

                                `).join("")}

                            </table>

                        </div>
                    `;

                    break;
            }
        });
    });
}

// ========================= INICIALIZAÇÃO =========================
document.addEventListener(
    "DOMContentLoaded",
    configurarCards
);