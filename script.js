

// Nome do usuario sendo salvo como constante global, pois não deve mudar caso a página não seja recarregada
let nomeUsuario;
let objetoNomeUsuario;

// Array que guarda as mensagens
let mensagens = [];

// Array que guarda os participantes
let listaParticipantes = [];

let destinatario;
let visibilidade;

// Objeto que guarda o destrinatario todos
const objetoTodos = {name: "Todos"};

document.addEventListener('keypress', function(e){
    if(e.which === 13){
        enviarMensagem();
    }
 }, false);


function enviarNomeUsuario (){
    nomeUsuario = document.querySelector(".entrada-nome-usuario").value;
    objetoNomeUsuario = {name: nomeUsuario};
    const requisicaoEnvioDeNome = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objetoNomeUsuario);
    console.log(objetoNomeUsuario);

    requisicaoEnvioDeNome.then(envioNomeSucesso);
    requisicaoEnvioDeNome.catch(envioNomeErro);

    document.querySelector(".dados-entrada").classList.add("escondido");
    document.querySelector(".carregando-login").classList.remove("escondido");

    function envioNomeSucesso(){
        document.querySelector(".tela-de-entrada").classList.add("escondido");
        buscaMensagens();
        buscarParticipantes();
        setInterval(confirmaAtividade, 5000);
        setInterval(buscaMensagens, 3000);
        setInterval(buscarParticipantes, 10000);
        destinatario = "Todos";
        visibilidade = "Público";
    }

    function envioNomeErro(){
        alert("Esse nome de usuario já está em uso");
        document.querySelector(".dados-entrada").classList.remove("escondido");
        document.querySelector(".carregando-login").classList.add("escondido");
    }
}

function confirmaAtividade(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objetoNomeUsuario);

}

function buscaMensagens(){
    const requisicaoMensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    requisicaoMensagens.then(guardarMensagens);
}

function guardarMensagens(objetoMensagens){
    mensagens = [];
    mensagens = objetoMensagens.data;

    exibirMensagens();
}

function exibirMensagens(){

    const listaDeMensagens = document.querySelector("ul");
    listaDeMensagens.innerHTML = '';

    for(let i = 0; i < mensagens.length; i++){
        let mensagemAExibir = '';

        if(mensagens[i].type === 'status'){
            mensagemAExibir = `
                <li data-test="message" class="mesagem-de-status posicao${i}">
                    <p><span class="horario-de-envio">(${mensagens[i].time})</span>  <span class="remetente">${mensagens[i].from}</span>  <span class="mensagem">${mensagens[i].text}</span></p>
                </li>`}

        else if(mensagens[i].type === 'message'){
            mensagemAExibir = `
                <li data-test="message" class="mensagem-normal posicao${i}">
                    <p><span class="horario-de-envio">(${mensagens[i].time})</span>  <span class="remetente">${mensagens[i].from}</span> para <span class="destinatario">${mensagens[i].to}</span>:  <span class="mensagem">${mensagens[i].text}</span></p>
                </li>`}

        else if(mensagens[i].type === 'private_message' && (mensagens[i].from === nomeUsuario || mensagens[i].to === nomeUsuario)){
            mensagemAExibir = `
                <li data-test="message" class="mensagem-reservada posicao${i}">
                    <p><span class="horario-de-envio">(${mensagens[i].time})</span>  <span class="remetente">${mensagens[i].from}</span> para <span class="destinatario">${mensagens[i].to}</span>:  <span class="mensagem">${mensagens[i].text}</span></p>
                </li>`}

        listaDeMensagens.innerHTML = listaDeMensagens.innerHTML + mensagemAExibir;

    }
    const posicaoUltimaMensagem = mensagens.length - 1;
    const ultimaMensagem = document.querySelector(`.posicao${posicaoUltimaMensagem}`);
    ultimaMensagem.scrollIntoView();
}

function enviarMensagem(){
    const mensagemDigitada = document.querySelector(".campo-mensagem").value;
    let tipoMensagem;

    if(visibilidade === "Público"){
        tipoMensagem = "message";
    }
    else if(visibilidade === "Reservadamente"){
        tipoMensagem = "private_message";
    }

    const objetoMensagem = {
        from: nomeUsuario,
        to: destinatario,
        text: mensagemDigitada,
        type: tipoMensagem
    }

    const envioMensagemServidor = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objetoMensagem);

    envioMensagemServidor.then(mensagemEnviada);
    envioMensagemServidor.catch(mensagemNaoEnviada);

    function mensagemEnviada(){
        buscaMensagens();
        document.querySelector(".campo-mensagem").value = '';
    }

    function mensagemNaoEnviada(){
        window.location.reload();
    }
}

function mostrarParticipantes(){
    document.querySelector(".selecao-contato").classList.remove("escondido");
    buscarParticipantes()
}

function ocultarParticipantes(){
    document.querySelector(".selecao-contato").classList.add("escondido");
}

function buscarParticipantes(){
    const requisicaoParticipantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

    requisicaoParticipantes.then(buscouParticipantes);
}

function buscouParticipantes(participantes){
    listaParticipantes = [];
    listaParticipantes = participantes.data;

    let destinatarioAtivo;
    verificaDestinatario()
    
    if(destinatarioAtivo){
        exibeParticipantes();
    }

    else{
        destinatario = "Todos";
        exibeParticipantes();
    }

    function verificaDestinatario(){
        for(let i = 0; i < listaParticipantes.length; i++){
            if(listaParticipantes[i].name === destinatario){
                destinatarioAtivo = destinatario;
            }
        }
    }
    console.log(destinatario);
    console.log(visibilidade);
}

function exibeParticipantes(){
    const elementoListaParticipantes = document.querySelector(".contatos");

    elementoListaParticipantes.innerHTML = `
        <li onclick="selecionarDestinatario(this)" data-test="all">
            <div>
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <ion-icon name="checkmark" class="checkmark-participante escondido" data-test="check"></ion-icon>
        </li>`;

    let elementoParticipante;

    for(let i = 0; i < listaParticipantes.length; i++){
        if(listaParticipantes[i].name !== nomeUsuario && listaParticipantes[i].name !== "Todos"){
            elementoParticipante = `
                <li onclick="selecionarDestinatario(this)" data-test="participant">
                    <div>
                        <ion-icon name="person-circle"></ion-icon>
                        <p>${listaParticipantes[i].name}</p>
                    </div>
                    <ion-icon name="checkmark" class="checkmark-participante escondido" data-test="check"></ion-icon>
                </li>`;

            elementoListaParticipantes.innerHTML = elementoListaParticipantes.innerHTML + elementoParticipante;
        }
    }

    marcaDestinatario();
}

function marcaDestinatario(){
    const participantesListados = document.querySelectorAll(".checkmark-participante");
    
    for(let i = 0; i < participantesListados.length; i++){
        const parentParticipanteListado = participantesListados[i].parentNode;
        const nomeParticipante = parentParticipanteListado.querySelector("p").innerHTML;

        if(nomeParticipante === destinatario){
            participantesListados[i].classList.add("selecionado");
            participantesListados[i].classList.remove("escondido");
        }
    }

}

const destinatarioInput = document.querySelector(".mostrar-destinatario");

function selecionarDestinatario(destinatarioSelecionado){
    destinatario = destinatarioSelecionado.querySelector("p").innerHTML;

    // Remove o selecionado e marca o novo
    const listaDestinatarios = destinatarioSelecionado.parentNode;
    const checkJaSelecionado = listaDestinatarios.querySelector(".selecionado");

    checkJaSelecionado.classList.add("escondido");
    checkJaSelecionado.classList.remove("selecionado");

    const checkSelecionado = destinatarioSelecionado.querySelector(".checkmark-participante");
    checkSelecionado.classList.add("selecionado");
    checkSelecionado.classList.remove("escondido");

    if(visibilidade === "Reservadamente"){
        destinatarioInput.innerHTML = `Enviando para ${destinatario} (reservadamente)`;
    }

    else if(visibilidade === "Público"){
        destinatarioInput.innerHTML = ``;
        }
}

function selecionarVisibilidade(visibilidadeSelecionada){
    visibilidade = visibilidadeSelecionada.querySelector("p").innerHTML;

    // Remove o selecionado e marca o novo
    const listaVisibilidade = visibilidadeSelecionada.parentNode;
    const checkJaSelecionado = listaVisibilidade.querySelector(".selecionado");

    checkJaSelecionado.classList.add("escondido");
    checkJaSelecionado.classList.remove("selecionado");

    const checkSelecionado = visibilidadeSelecionada.querySelector(".checkmark");
    checkSelecionado.classList.add("selecionado");
    checkSelecionado.classList.remove("escondido");

    if(visibilidade === "Reservadamente"){
    destinatarioInput.innerHTML = `Enviando para ${destinatario} (reservadamente)`;
    }

    else if(visibilidade === "Público"){
        destinatarioInput.innerHTML = ``;
        }
}
