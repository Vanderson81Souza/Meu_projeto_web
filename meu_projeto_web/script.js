const API_BASE = "http://localhost:5000/api";

// ========================= HELPERS =========================
async function fetchJson(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Erro ${response.status}: ${body}`);
    }

    return response.json();
}

function formatCurrency(value) {
    return Number(value || 0).toFixed(2);
}

function exibirMensagemErro(elementId, mensagem) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.innerHTML = `<p style="color: #f97316;">${mensagem}</p>`;
    }
}

// ========================= API ANIMAIS =========================
async function obterAnimais() {
    return fetchJson("/animals");
}

async function salvarAnimal(animal) {
    return fetchJson("/animals", {
        method: "POST",
        body: JSON.stringify(animal),
    });
}

// ========================= API SERVIÇOS =========================
async function obterServicos(query = "") {
    const path = query ? `/services${query}` : "/services";
    return fetchJson(path);
}

async function salvarServico(servico) {
    return fetchJson("/services", {
        method: "POST",
        body: JSON.stringify(servico),
    });
}

// ========================= HISTÓRICO =========================
async function carregarHistorico() {
    const conteudo = document.getElementById("conteudo");
    let animais = [];

    try {
        animais = await obterAnimais();
    } catch (error) {
        conteudo.innerHTML = `<p>Erro ao carregar animais: ${error.message}</p>`;
        return;
    }

    conteudo.innerHTML = `
        <div class="historico-container">
            <div class="filtros-historico">
                <div>
                    <label>Animal:</label>
                    <select id="filtroAnimal">
                        <option value="">Todos</option>
                        ${animais.map(animal => `
                            <option value="${animal.id}">${animal.nome}</option>
                        `).join("")}
                    </select>
                </div>

                <div>
                    <label>Veterinário:</label>
                    <select id="filtroVet">
                        <option value="">Todos</option>
                        <option>Dr. Silva</option>
                        <option>Dra. Costa</option>
                        <option>Dr. Almeida</option>
                        <option>Dra. Santos</option>
                        <option>Dr. Oliveira</option>
                    </select>
                </div>

                <div>
                    <label>Mês:</label>
                    <input type="month" id="filtroMes">
                </div>

                <button id="btnFiltrar">Filtrar</button>
            </div>

            <br>
            <div id="resultadoHistorico" class="resultado-historico"></div>
        </div>
    `;

    const resultado = document.getElementById("resultadoHistorico");
    resultado.innerHTML = `
        <div class="historico-instrucao">
            <p>Selecione os filtros e clique em <strong>Filtrar</strong> para ver o histórico.</p>
        </div>
    `;

    async function renderizarHistorico() {
        const filtroAnimal = document.getElementById("filtroAnimal").value;
        const filtroVet = document.getElementById("filtroVet").value;
        const filtroMes = document.getElementById("filtroMes").value;

        const params = new URLSearchParams();
        if (filtroAnimal) params.set("animal_id", filtroAnimal);
        if (filtroVet) params.set("vet", filtroVet);
        if (filtroMes) params.set("month", filtroMes);

        try {
            const servicos = await obterServicos(params.toString() ? `?${params.toString()}` : "");

            if (!servicos || servicos.length === 0) {
                resultado.innerHTML = "<p>Nenhum registro encontrado.</p>";
                return;
            }

            resultado.innerHTML = servicos.map(servico => {
                const valorFormatado = formatCurrency(servico.valor);
                const animal = servico.animal || {};

                return `
                    <div class="resultado-area">
                        <h3>${servico.tipo} - ${animal.nome || "Animal"}</h3>
                        <p><strong>Data do Serviço:</strong> ${servico.data}</p>
                        <p><strong>Veterinário:</strong> ${servico.vet}</p>
                        <p><strong>Valor:</strong> R$ ${valorFormatado}</p>
                        <p><strong>Tipo de serviço:</strong> ${servico.tipo}</p>
                        <hr>
                        <h4>Dados completos do Animal</h4>
                        <p><strong>Nome:</strong> ${animal.nome || "-"}</p>
                        <p><strong>Espécie:</strong> ${animal.especie || "-"}</p>
                        <p><strong>Raça:</strong> ${animal.raca || "-"}</p>
                        <p><strong>Idade:</strong> ${animal.idade || "-"}</p>
                        <p><strong>Dono:</strong> ${animal.dono || "-"}</p>
                        <p><strong>Contato do dono:</strong> ${animal.contatoDono || "-"}</p>
                    </div>
                `;
            }).join("");
        } catch (error) {
            resultado.innerHTML = `<p>Erro ao carregar histórico: ${error.message}</p>`;
        }
    }

    document.getElementById("btnFiltrar").addEventListener("click", async () => {
        await renderizarHistorico();
    });
}

// ========================= NAVEGAÇÃO =========================
function configurarCards() {
    const cards = document.querySelectorAll(".card");
    const conteudo = document.getElementById("conteudo");

    cards.forEach(card => {
        card.addEventListener("click", async () => {
            const section = card.getAttribute("data-section");

            switch (section) {
                case "clientes": {
                    let animais = [];
                    try {
                        animais = await obterAnimais();
                    } catch (error) {
                        conteudo.innerHTML = `<p>Erro ao carregar animais: ${error.message}</p>`;
                        return;
                    }

                    conteudo.innerHTML = `
                        <div class="cadastro-container">
                            <div class="form-area">
                                <form id="formServicos">
                                    <label>Nome do Animal:</label>
                                    <select id="animalServico" required>
                                        <option value="">Selecione...</option>
                                        ${animais.map(animal => `
                                            <option value="${animal.id}">${animal.nome}</option>
                                        `).join("")}
                                    </select>

                                    <label>Serviço:</label>
                                    <select id="tipoServico" required>
                                        <option value="">Selecione...</option>
                                        <option>Consulta</option>
                                        <option>Vacina</option>
                                        <option>Emergência</option>
                                        <option>Internação</option>
                                        <option>Exames</option>
                                    </select>

                                    <label>Data:</label>
                                    <input type="date" id="dataServico" required>

                                    <label>Valor:</label>
                                    <input type="number" id="valorServico" step="0.01" required>

                                    <label>Veterinário:</label>
                                    <select id="vetServico" required>
                                        <option>Dr. Silva</option>
                                        <option>Dra. Costa</option>
                                        <option>Dr. Almeida</option>
                                        <option>Dra. Santos</option>
                                        <option>Dr. Oliveira</option>
                                    </select>

                                    <button type="submit">Registrar Serviço</button>
                                </form>
                            </div>
                            <div class="resultado-area" id="resultadoServicos"></div>
                        </div>
                    `;

                    document.getElementById("formServicos").addEventListener("submit", async event => {
                        event.preventDefault();

                        const animalId = Number(document.getElementById("animalServico").value);
                        const tipo = document.getElementById("tipoServico").value;
                        const data = document.getElementById("dataServico").value;
                        const valor = document.getElementById("valorServico").value;
                        const vet = document.getElementById("vetServico").value;

                        const animalSelecionado = animais.find(a => a.id === animalId);
                        if (!animalSelecionado) {
                            exibirMensagemErro("resultadoServicos", "Selecione um animal válido.");
                            return;
                        }

                        try {
                            await salvarServico({
                                animal_id: animalId,
                                tipo,
                                data,
                                valor,
                                vet,
                            });

                            document.getElementById("resultadoServicos").innerHTML = `
                                <h3>Serviço registrado!</h3>
                                <br>
                                <p><strong>Animal:</strong> ${animalSelecionado.nome}</p>
                                <p><strong>Serviço:</strong> ${tipo}</p>
                                <p><strong>Data:</strong> ${data}</p>
                                <p><strong>Valor:</strong> R$ ${formatCurrency(valor)}</p>
                                <p><strong>Veterinário:</strong> ${vet}</p>
                            `;
                        } catch (error) {
                            exibirMensagemErro("resultadoServicos", `Erro ao registrar serviço: ${error.message}`);
                        }

                        document.getElementById("formServicos").reset();
                    });
                    break;
                }

                case "animais": {
                    conteudo.innerHTML = `
                        <div class="cadastro-container">
                            <div class="form-area">
                                <form id="formAnimais">
                                    <label>Nome do Animal:</label>
                                    <input type="text" id="nome" required>

                                    <label>Espécie:</label>
                                    <input type="text" id="especie" required>

                                    <label>Raça:</label>
                                    <input type="text" id="raca">

                                    <label>Idade:</label>
                                    <input type="number" id="idade">

                                    <label>Dono:</label>
                                    <input type="text" id="dono" required>

                                    <label>Contato do Dono:</label>
                                    <input type="text" id="contatoDono">

                                    <button type="submit">Cadastrar</button>
                                </form>
                            </div>
                            <div class="resultado-area" id="resultado"></div>
                        </div>
                    `;

                    document.getElementById("formAnimais").addEventListener("submit", async event => {
                        event.preventDefault();

                        const animal = {
                            nome: document.getElementById("nome").value,
                            especie: document.getElementById("especie").value,
                            raca: document.getElementById("raca").value,
                            idade: document.getElementById("idade").value,
                            dono: document.getElementById("dono").value,
                            contatoDono: document.getElementById("contatoDono").value,
                        };

                        try {
                            const savedAnimal = await salvarAnimal(animal);
                            document.getElementById("resultado").innerHTML = `
                                <h3>Animal cadastrado!</h3>
                                <br>
                                <p><strong>Nome:</strong> ${savedAnimal.nome}</p>
                                <p><strong>Espécie:</strong> ${savedAnimal.especie}</p>
                                <p><strong>Raça:</strong> ${savedAnimal.raca}</p>
                                <p><strong>Idade:</strong> ${savedAnimal.idade}</p>
                                <p><strong>Dono:</strong> ${savedAnimal.dono}</p>
                                <p><strong>Contato:</strong> ${savedAnimal.contatoDono}</p>
                            `;
                        } catch (error) {
                            exibirMensagemErro("resultado", `Erro ao cadastrar animal: ${error.message}`);
                        }

                        document.getElementById("formAnimais").reset();
                    });
                    break;
                }

                case "historico":
                    await carregarHistorico();
                    break;

                case "financeiro": {
                    let servicos = [];
                    try {
                        servicos = await obterServicos();
                    } catch (error) {
                        conteudo.innerHTML = `<p>Erro ao carregar serviços: ${error.message}</p>`;
                        return;
                    }

                    const total = servicos.reduce((acc, servico) => acc + Number(servico.valor || 0), 0);

                    conteudo.innerHTML = `
                        <div>
                            <h2>Controle Financeiro</h2>
                            <br>
                            <h3>Total faturado: R$ ${formatCurrency(total)}</h3>
                            <br>
                            <table class="tabela-financeiro">
                                <tr>
                                    <th>Data</th>
                                    <th>Serviço</th>
                                    <th>Animal</th>
                                    <th>Valor</th>
                                </tr>
                                ${servicos.map(servico => `
                                    <tr>
                                        <td>${servico.data}</td>
                                        <td>${servico.tipo}</td>
                                        <td>${servico.animal?.nome || "-"}</td>
                                        <td>R$ ${formatCurrency(servico.valor)}</td>
                                    </tr>
                                `).join("")}
                            </table>
                        </div>
                    `;
                    break;
                }
            }
        });
    });
}

// ========================= INICIALIZAÇÃO =========================
document.addEventListener("DOMContentLoaded", configurarCards);
