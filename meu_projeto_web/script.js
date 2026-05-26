// Função de login
function fazerLogin() {
    let usuario = document.getElementById("usuario").value;
    let senha = document.getElementById("senha").value;
    let mensagem = document.getElementById("mensagem");

    if (usuario === "lele" && senha === "1981") {
        mensagem.style.color = "green";
        mensagem.innerHTML = "Login realizado com sucesso!";
    } else {
        mensagem.style.color = "red";
        mensagem.innerHTML = "Usuário ou senha inválidos";
    }
}

// Função de navegação dos cards
function configurarCards() {
    const cards = document.querySelectorAll(".card");
    const conteudo = document.getElementById("conteudo");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const section = card.getAttribute("data-section");

            switch (section) {
                case "clientes":
    conteudo.innerHTML = `
        <div class="cadastro-container">
            <div class="form-area">
                <form id="formServicos">
                    <label>Nome do Animal:</label>
                    <input type="text" id="animalServico" required>

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
                    <input type="number" id="valorServico" required>

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

    document.getElementById("formServicos").addEventListener("submit", function(event){
        event.preventDefault();
        const animal = document.getElementById("animalServico").value;
        const servico = document.getElementById("tipoServico").value;
        const data = document.getElementById("dataServico").value;
        const valor = document.getElementById("valorServico").value;
        const vet = document.getElementById("vetServico").value;

        // Mostra resultado na aba
        document.getElementById("resultadoServicos").innerHTML += `
            <h3>Serviço registrado!</h3>
            <p><strong>Animal:</strong> ${animal}</p>
            <p><strong>Serviço:</strong> ${servico}</p>
            <p><strong>Data:</strong> ${data}</p>
            <p><strong>Valor:</strong> R$ ${valor}</p>
            <p><strong>Veterinário:</strong> ${vet}</p>
            <hr>
        `;

        // INTEGRAÇÃO COM FINANCEIRO
        const financeiro = document.getElementById("conteudo");
        if(document.getElementById("tabelaFinanceiro") === null){
            financeiro.innerHTML += `
                <h2>Controle Financeiro</h2>
                <table class="tabela-financeiro" id="tabelaFinanceiro">
                    <tr><th>Data</th><th>Serviço</th><th>Animal</th><th>Valor</th></tr>
                </table>
            `;
        }
        document.getElementById("tabelaFinanceiro").innerHTML += `
            <tr>
                <td>${data}</td>
                <td>${servico}</td>
                <td>${animal}</td>
                <td>R$ ${valor}</td>
            </tr>
        `;
    });
    break;

                case "animais":
                    conteudo.innerHTML = `<div class="cadastro-container">
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

                    // Ativa o formulário
                    document.getElementById("formAnimais").addEventListener("submit", function(event){
                        event.preventDefault();
                        const nome = document.getElementById("nome").value;
                        const especie = document.getElementById("especie").value;
                        const raca = document.getElementById("raca").value;
                        const idade = document.getElementById("idade").value;
                        const dono = document.getElementById("dono").value;
                        const contatoDono = document.getElementById("contatoDono").value;

                        document.getElementById("resultado").innerHTML = `
                            <h3>Animal cadastrado!</h3>
                            <p><strong>Nome:</strong> ${nome}</p>
                            <p><strong>Espécie:</strong> ${especie}</p>
                            <p><strong>Raça:</strong> ${raca}</p>
                            <p><strong>Idade:</strong> ${idade}</p>
                            <p><strong>Dono:</strong> ${dono}</p>
                            <p><strong>Contato do Dono:</strong> ${contatoDono}</p>
                        `;
                    });
                    break;
                case "historico":
                    conteudo.innerHTML = "<h2>Histórico</h2><p>Aqui você consulta o histórico dos atendimentos.</p>";
                    break;
                case "financeiro":
                    conteudo.innerHTML = "<h2>Controle Financeiro</h2><p>Aqui você acompanha as finanças.</p>";
                    break;
            }
        });
    });
}

// Chama configuração dos cards ao carregar a página
document.addEventListener("DOMContentLoaded", configurarCards);
