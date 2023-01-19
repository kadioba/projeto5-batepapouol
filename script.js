

// Nome do usuario sendo salvo como constante global, pois não deve mudar caso a página não seja recarregada
let nomeUsuario;
let objetoNomeUsuario;

// Array que guarda as mensagens
let mensagens = [];

let usuarioLogado;

enviarNomeUsuario();

function enviarNomeUsuario (){
    nomeUsuario = prompt("Digite seu nome:");
    objetoNomeUsuario = {name: nomeUsuario};
    const requisicaoEnvioDeNome = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objetoNomeUsuario);

    requisicaoEnvioDeNome.then(envioNomeSucesso);
    requisicaoEnvioDeNome.catch(envioNomeErro);

    function envioNomeSucesso(resposta){
        entrouNaSala();
    }

    function envioNomeErro(resposta){
        naoEntrouNaSala();
    }
}

function entrouNaSala(){
    usuarioLogado = true;
    buscaMensagens();
    setInterval(confirmaAtividade, 5000);
    setInterval(buscaMensagens, 3000);
}

function naoEntrouNaSala(){
    usuarioLogado = false;
    enviarNomeUsuario();
}

function confirmaAtividade(){
    const requisicaoDeAtividade = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objetoNomeUsuario);

    requisicaoDeAtividade.then(conexaoAtiva);
    requisicaoDeAtividade.catch(conexaoPerdida);
}

function buscaMensagens(){
    if(usuarioLogado){
        const requisicaoMensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

        requisicaoMensagens.then(guardarMensagens);
    }
}

function guardarMensagens(objetoMensagens){
    mensagens = [];
    mensagens = objetoMensagens.data;
    console.log(mensagens);

    exibirMensagens();
}

function exibirMensagens(){

    const listaDeMensagens = document.querySelector("ul");
    listaDeMensagens.innerHTML = '';
    console.log(listaDeMensagens);

    for(let i = 0; i < mensagens.length; i++){
        let mensagemAExibir = '';

        if(mensagens[i].type == 'status'){
            console.log(mensagens[i].type);
            mensagemAExibir = `
                <li data-test="message" class="mesagem-de-status posicao${i}">
                    <p><span class="horario-de-envio">(${mensagens[i].time})</span>  <span class="remetente">${mensagens[i].from}</span>  <span class="mensagem">${mensagens[i].text}</span></p>
                </li>`
        }
        else if(mensagens[i].type == 'message'){
            mensagemAExibir = `
                <li data-test="message" class="mensagem-normal posicao${i}">
                    <p><span class="horario-de-envio">(${mensagens[i].time})</span>  <span class="remetente">${mensagens[i].from}</span> para <span class="destinatario">${mensagens[i].to}</span>:  <span class="mensagem">${mensagens[i].text}</span></p>
                </li>`
        }
        else if(mensagens[i].type == 'private_message'){
            if(mensagens[i].from == nomeUsuario || mensagens[i].to == nomeUsuario){
                mensagemAExibir = `
                    <li data-test="message" class="mensagem-reservada posicao${i}">
                        <p><span class="horario-de-envio">(${mensagens[i].time})</span>  <span class="remetente">${mensagens[i].from}</span> para <span class="destinatario">${mensagens[i].to}</span>:  <span class="mensagem">${mensagens[i].text}</span></p>
                    </li>`
            }
        }
        listaDeMensagens.innerHTML = listaDeMensagens.innerHTML + mensagemAExibir;

    }
    const posicaoUltimaMensagem = mensagens.length - 1;
    console.log(posicaoUltimaMensagem);
    const ultimaMensagem = document.querySelector(`.posicao${posicaoUltimaMensagem}`);
    console.log(ultimaMensagem);
    ultimaMensagem.scrollIntoView();
}

function enviarMensagem(){
    const mensagemDigitada = document.querySelector(".enviar-mensagem").value;

    const objetoMensagem = {
        from: nomeUsuario,
        to: "Todos",
        text: mensagemDigitada,
        type: "message"
    }

    const envioMensagemServidor = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objetoMensagem);

    envioMensagemServidor.then(mensagemEnviada);
    envioMensagemServidor.catch(mensagemNaoEnviada);

    function mensagemEnviada(dadosMensagemEnviada){
        buscaMensagens();
        document.querySelector(".enviar-mensagem").value = '';
    }

    function mensagemNaoEnviada(){
        window.location.reload();
    }
}