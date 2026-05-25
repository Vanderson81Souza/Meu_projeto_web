function fazerLogin(){

    // Captura os valores
    let usuario = document.getElementById("usuario").value;

    let senha = document.getElementById("senha").value;

    let mensagem = document.getElementById("mensagem");

    // Usuário teste
    if(usuario === "lele" && senha === "1981"){

        mensagem.style.color = "green";

        mensagem.innerHTML = "Login realizado com sucesso!";

    }else{

        mensagem.style.color = "red";

        mensagem.innerHTML = "Usuário ou senha inválidos";

    }
    // Seleciona todos os cards
    const cards = document.querySelectorAll(".card");

    // Adiciona  clique aos cards como um botão
        cards.forEach(card => {
            card.addEventListener("click", () => {
                const url = card.getAttribute("data-url");
        if(url){
            window.open(url, "_blank"); // abre em nova aba
        }
    });
});

// nova função para abrir o card em nova aba
document.getElementById("formAnimais").addEventListener("submit", function(event){
    event.preventDefault();

    // Captura os valores
    const nome = document.getElementById("nome").value;
    const especie = document.getElementById("especie").value;
    const raca = document.getElementById("raca").value;
    const idade = document.getElementById("idade").value;
    const dono = document.getElementById("dono").value;
    const contato = document.getElementById("contato").value;

    // Exibe resultado simples
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
        <h3>Animal cadastrado!</h3>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Espécie:</strong> ${especie}</p>
        <p><strong>Raça:</strong> ${raca}</p>
        <p><strong>Idade:</strong> ${idade}</p>
        <p><strong>Dono:</strong> ${dono}</p>
        <p><strong>Contato:</strong> ${contato}</p>
    `;
});



}