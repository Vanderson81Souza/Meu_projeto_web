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


}