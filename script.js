

// Nome do usuario sendo salvo como constante global, pois não deve mudar caso a página não seja recarregada
let nomeUsuario;
let objetoNomeUsuario;

enviarNomeUsuario();

function enviarNomeUsuario (){
    nomeUsuario = prompt("Digite seu nome:");
    objetoNomeUsuario = {name: nomeUsuario};
    const requisicaoEnvioDeNome = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objetoNomeUsuario);

    requisicaoEnvioDeNome.then(envioNomeSucesso);
    requisicaoEnvioDeNome.catch(envioNomeErro);

    function envioNomeSucesso(resposta){
        console.log("Sucesso");
        console.log("then");
        console.log(resposta);
        setInterval(confirmaAtividade, 5000);
    }

    function envioNomeErro(resposta){
        let codigoErro = resposta.response.status;
        console.log(codigoErro);
        enviarNomeUsuario();
    }

    
}

function confirmaAtividade(){
    const requisicaoDeAtividade = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objetoNomeUsuario);

    requisicaoDeAtividade.then(conexaoAtiva);
    requisicaoDeAtividade.catch(conexaoPerdida);

    function conexaoAtiva(resposta){
        console.log("conexao ativa");
        console.log(resposta);
    }

    function conexaoPerdida(resposta){
        console.log("conexao perdida");
        console.log(resposta);
    }
}