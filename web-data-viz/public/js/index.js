var telaAtual = document.getElementById('home')
var dadosencontrados = false

function trocarTela(idProxTela) {
    telaAtual.classList.add('esconder') //adiciona a classe
    var proxTela = document.getElementById(idProxTela)

    if (idProxTela == 'perfil' && sessionStorage.length == 0) {
        proxTela = document.getElementById('login')
    } else if (idProxTela == 'perfil' && dadosencontrados == false) {
        return selectperfil()
    } else if (idProxTela == 'dadosgerais') {
        coletarperfisgeral()
    }
    dadosencontrados = false
    proxTela.classList.remove('esconder') //remove a classe
    telaAtual = proxTela
}

function selectperfil() {

    fetch(`/usuarios/selectperfil/${sessionStorage.ID_USUARIO}`, {
        cache: 'no-store'
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.json().then(json => {
                    console.log('perfil coletado', JSON.stringify(json));
                    if (json.resultado.length == 0) {
                        trocarTela('perfilVazio') //CASO NÃO TENHA QUIZ AINDA
                        return
                    }
                    var perfila = json.resultado[0].perfila
                    var perfilb = json.resultado[0].perfilb
                    var perfilc = json.resultado[0].perfilc

                    if (perfila == null || perfilb == null || perfilc == null) {
                        trocarTela('perfilVazio') //CASO NÃO TENHA QUIZ AINDA
                        return
                    } else {
                        dadosencontrados = true
                        exibirResultado(perfila, perfilb, perfilc)
                        atualizarGrafico(perfila, perfilb)
                        trocarTela('perfil')
                        return
                    }
                })
            } else {
                throw "Houve um erro ao tentar coletar os perfis";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function logout() {
    sessionStorage.clear()
    window.location.href = 'index.html'
}
// Função para validar email usando regex
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // ^ – Início da string.
    // [^\s@]+ – Um ou mais caracteres que não sejam espaço ou @.
    // @ – Um @ obrigatório.
    // [^\s@]+ – Um ou mais caracteres que não sejam espaço ou @ (parte do domínio).
    // \. – Um ponto obrigatório ..
    // [^\s@]+ – Um ou mais caracteres que não sejam espaço ou @ (domínio de nível superior).
    // $ – Fim da string.
    return regex.test(email);
}
function cadastrar() {
    // aguardar();

    //Recupere o valor da nova input pelo nome do id
    var nomeVar = inputNome.value;
    var emailVar = inputEmail.value;
    var userVar = inputUsuario.value;
    var senhaVar = document.querySelector('#inputSenhaCadastro').value;
    var verificarSenha = document.getElementById('inputSenhaVerificar').value;


    if (senhaVar != verificarSenha) {
        divErros.innerHTML = '<img src="https://static.tumblr.com/rltvkjt/9lnlmr41u/th_k_atencao.gif" style="max-height:2vh; vertical-align: middle;"> <text>AS SENHAS NÃO CONFEREM</text><br>'
        return
    } else if (nomeVar == "" || emailVar == "" || userVar == "" || senhaVar == "") {
        divErros.innerHTML = '<img src="https://static.tumblr.com/rltvkjt/9lnlmr41u/th_k_atencao.gif" style="max-height:2vh; vertical-align: middle;"> <text>POR FAVOR, PREENCHA TODOS OS CAMPOS</text><br>'
        return
    } else if (!validarEmail(emailVar)) {
      divErros.innerHTML = '<img src="https://static.tumblr.com/rltvkjt/9lnlmr41u/th_k_atencao.gif" style="max-height:2vh; vertical-align: middle;"> <text>EMAIL INVÁLIDO</text><br>';
      return
    }
        // Enviando o valor da nova input
        fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // body: PASSANDO AS INFORMAÇÕES PRO CONTROLLER
            body: JSON.stringify({
                nomeServer: nomeVar,
                emailServer: emailVar,
                userServer: userVar,
                senhaServer: senhaVar
            }),
        }) //depois de route > controller > models > insere DB + o caminho de volta até o controller (DB > models > controller), segue pro then:
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    divErros.innerHTML = '<text>Cadastro realizado com sucesso!</text><br>'
                    setTimeout(() => {
                        trocarTela('login');
                    }, "1000");

                } else {
                    throw "Houve um erro ao tentar realizar o cadastro!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
}

function autenticar() {
    // aguardar();

    //Recupere o valor da nova input pelo nome do id
    // Agora vá para o método fetch logo abaixo
    var userVar = inputUsuarioLogin.value;
    var senhaVar = document.querySelector('#inputSenhaLogin').value;

    if(userVar==""||senhaVar==""){
        divErrosLogin.innerHTML= `<img src="https://static.tumblr.com/rltvkjt/9lnlmr41u/th_k_atencao.gif" style="max-height:2vh; vertical-align: middle;"> <text>Por favor, preencha todos os campos</text><br>`
        return
    }
    // Enviando o valor da nova input
    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // body: PASSANDO AS INFORMAÇÕES PRO CONTROLLER
        body: JSON.stringify({
            userServer: userVar,
            senhaServer: senhaVar
        }),
    }) //depois de route > controller > models > insere DB + o caminho de volta até o controller (DB > models > controller), segue pro then:
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));
                    sessionStorage.ID_USUARIO = json.id;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.USUARIO_USUARIO = json.usuario;
                })
                divErrosLogin.innerHTML= `Login realizado com sucesso`
                setTimeout(() => {
                    trocarTela('perfil');
                }, "1000");

                document.getElementById('logout').style.display = 'flex'

            } else {
                divErrosLogin.innerHTML= `<img src="https://static.tumblr.com/rltvkjt/9lnlmr41u/th_k_atencao.gif" style="max-height:2vh; vertical-align: middle;"> <text>Houve um erro ao tentar realizar o login!</text>`
                throw "Houve um erro ao tentar realizar o login!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function inserirtentativa() {
    // aguardar();

    //Recupere o valor da nova input pelo nome do id
    // Agora vá para o método fetch logo abaixo
    var idusuarioVar = sessionStorage.ID_USUARIO;
    var idquizVar = 1;

    // Enviando o valor da nova input
    fetch("/usuarios/inserirtentativa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // body: PASSANDO AS INFORMAÇÕES PRO CONTROLLER
        body: JSON.stringify({
            fkusuarioServer: idusuarioVar,
            idquizServer: idquizVar
        }),
    }) //depois de route > controller > models > insere DB + o caminho de volta até o controller (DB > models > controller), segue pro then:
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                console.log('tentativa inserida');

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));

                    // Armazena o idtentativa no sessionStorage
                    if (json.idtentativa) {
                        sessionStorage.setItem('ID_TENTATIVA', json.idtentativa);
                        console.log('ID da tentativa armazenado:', json.idtentativa);
                    } else {
                        console.error('ID da tentativa não encontrado na resposta.');
                    }
                });
            } else {
                throw "Houve um erro ao tentar inserir tentativa!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });


}
function exibirResultado(a, b, c) {
    const elemento = document.getElementById('resultadosPerfis')
    const img = document.getElementById('plakinha')

    if (a > b) {
        img.src = "@assets/plakinhaA.gif"
        elemento.innerHTML = `
        <div class="faixaBubbles">
                        <h3>DESCOBRIDOR DOS 7 MARES</h3>
                    </div>
                    Você é destemido como as ondas do mar, sempre disposto a mergulhar de cabeça no desconhecido. O
                    perigo e a
                    incerteza não te intimidam, eles são o combustível para sua curiosidade e coragem. Cada
                    escolha é uma nova oportunidade para descobrir segredos e desafiar limites. Como um verdadeiro
                    explorador dos
                    mares, você sabe que as maiores recompensas vêm dos maiores riscos.
        `
    } else if (b > a) {
        img.src = "@assets/plakinhaB.gif"
        elemento.innerHTML = `
        <div class="faixaBubbles">
                        <h3>A CONCHA GUARDIÃ</h3>
                    </div>
                    Você valoriza a segurança e a sabedoria, protegendo-se como uma concha guarda sua pérola. Cada passo
                    é
                    cuidadosamente considerado, e você sabe que a paciência e a observação são virtudes poderosas.
                    Prefere preservar
                    o que é precioso e evitar perigos desnecessários, confiando em sua intuição e respeito pelos
                    mistérios do
                    oceano.
        `
    } else {
        img.src = "@assets/plakinhaC.gif"
        elemento.innerHTML = `
        <div class="faixaBubbles" style="display:flex; justify-content: flex-start; flex-wrap: nowrap; align-items: center;">
                        <h3>SONHADOR DAS MARÉS</h3> <img src="../@assets/perfil-equilibrado.png" width="120px" height="auto" style="margin-left:2%">
                    </div>
                    Você navega com equilíbrio entre coragem e cautela, como alguém que compreende os ciclos das marés.
                    Sabe quando arriscar para avançar e quando recuar para proteger o que importa. Esse equilíbrio faz de você uma pessoa
                    estrategista, capaz de encontrar soluções criativas e alcançar seus objetivos, respeitando o ritmo
                    do oceano e da vida.`
    }
}
function atualizarGrafico(perfila, perfilb) {
    grafico.data.datasets[0].data = [perfila, perfilb]
    grafico.update()
}

function coletarperfisgeral() {

    fetch(`/usuarios/coletarperfisgeral`)

        //VOLTA AQUI DEPOIS DE FAZER TODA A ROTA ATÉ O BD
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.json().then(json => {
                    console.log('perfis gerais coletados', JSON.stringify(json));

                    var perfila = json[0].qtd
                    var perfilb = json[1].qtd
                    var perfilc = json[2].qtd
                    atualizarGraficoGeral(perfila, perfilb, perfilc)
                    return
                })
            } else {
                throw "Houve um erro ao tentar coletar os perfis";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function atualizarGraficoGeral(perfila, perfilb, perfilc) {
    grafico2.data.datasets[0].data = [perfila, perfilb, perfilc]
    grafico2.update()
    document.getElementById('valorA').innerHTML = `${perfila}`
    document.getElementById('valorB').innerHTML = `${perfilb}`
    document.getElementById('valorC').innerHTML = `${perfilc}`
}

const ctx = document.getElementById('myChart');
if (ctx) {
    var grafico =
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Descobridor dos 7 Mares',
                    'A Concha Guardiã'
                ],
                datasets: [{
                    // label: ['Pontuação'],
                    data: [],
                    backgroundColor: [
                        'rgb(179,139,221, 0.6)', //ROXO
                        'rgb(19,163,164, 0.6)' //VERDE
                    ],
                    borderWidth: 0.5, // Define a largura da borda
                    // borderDash: [2, 2], // Define o padrão da linha pontilhada
                }]
            },

            options: {
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'white', // Define a cor da fonte
                            font: {
                                size: 12, // Define o tamanho da fonte (opcional)
                                family: 'Imprima', // Define a família da fonte (opcional)
                                // style: 'italic' // Define o estilo (normal, italic, bold)
                            },
                            boxWidth: 10, // Largura do ícone da legenda
                            boxHeight: 10, // Altura do ícone da legenda
                            // useBorderRadius: true, // Torna o ícone com bordas arredondadas
                            borderWidth: 0.5, // Define a largura da borda dos ícones
                            usePointStyle: true, // Define ícones redondos
                            pointStyle: 'circle', // Estilo dos ícones (default é círculo)
                        }
                    }
                },
            }

        });
}


// GERAL

const ctx2 = document.getElementById('myChart2');
if (ctx2) {
    var grafico2 =
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: [
                    'Descobridor dos 7 Mares',
                    'A Concha Guardiã',
                    'Sonhador dos Mares'
                ],
                datasets: [{
                    // label: ['Pontuação'],
                    data: [],
                    backgroundColor: [
                        'rgb(179,139,221, 0.6)', //ROXO
                        'rgb(19,163,164, 0.6)', //VERDE
                        'rgb(255,98,137,0.6)' //ROSA
                    ],
                    borderWidth: 0.5, // Define a largura da borda
                    // borderDash: [2, 2], // Define o padrão da linha pontilhada
                }]
            },

            options: {
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white', // Define a cor da fonte
                            font: {
                                size: 12, // Define o tamanho da fonte (opcional)
                                family: 'Imprima', // Define a família da fonte (opcional)
                                // style: 'italic' // Define o estilo (normal, italic, bold)
                            },
                            boxWidth: 10, // Largura do ícone da legenda
                            boxHeight: 10, // Altura do ícone da legenda
                            // useBorderRadius: true, // Torna o ícone com bordas arredondadas
                            borderWidth: 0.5, // Define a largura da borda dos ícones
                            usePointStyle: true, // Define ícones redondos
                            pointStyle: 'circle', // Estilo dos ícones (default é círculo)
                        }
                    }
                },
            }

        });
}



