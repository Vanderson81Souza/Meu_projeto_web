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
                    conteudo.innerHTML = "<h2>Controle de Clientes</h2><p>Aqui você gerencia os clientes.</p>";
                    break;
                case "animais":
                    conteudo.innerHTML = `
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
                        <div id="resultado"></div>
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
