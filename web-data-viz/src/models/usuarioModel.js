//rota > controller > model > database

var database = require("../database/config")

function autenticar(usuario, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", usuario, senha)
    var instrucaoSql = `
        SELECT idusuario, nome, email, usuario, senha FROM usuario WHERE usuario = '${usuario}' AND senha = '${senha}' limit 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrarModel(nome, email, usuario, senha) {
    console.log('cheguei model')

    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, usuario, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, usuario, senha) VALUES ('${nome}', '${email}', '${usuario}','${senha}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function inserirtentativaModel(fkusuario,idquiz) {

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO tentativas (fkusuario, fkquiz) VALUES ('${fkusuario}', '${idquiz}');
        SELECT LAST_INSERT_ID() AS idtentativa;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function inseriropcaoModel(fkperguntas,fkquiz,fkusuario,alternativa) {

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO opcoes VALUES ('${fkperguntas}','${fkquiz}',
        (select max(idtentativa) from tentativas where fkusuario=${fkusuario})
        ,'${fkusuario}','${alternativa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function updatetentativaModel(fkusuario,idtentativa,perfila,perfilb,perfilc) {

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        UPDATE tentativas SET perfila='${perfila}', perfilb='${perfilb}', perfilc='${perfilc}' WHERE fkusuario=${fkusuario} AND idtentativa=${idtentativa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function selectperfilModel(idusuario) {

    var instrucaoSql = `
    SELECT perfila,perfilb,perfilc from tentativas where fkusuario=${idusuario} order by datahora desc limit 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function coletarperfisgeralModel() {

    var instrucaoSql = `
    SELECT Perfil, COUNT(*) AS qtd
FROM (
    SELECT CASE
        WHEN perfila > perfilb THEN 'A'
        WHEN perfilb > perfila THEN 'B'
        ELSE 'C'
    END AS Perfil
    FROM tentativas
) AS Perfis
GROUP BY Perfil
ORDER BY Perfil;
`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrarModel,
    inserirtentativaModel,
    inseriropcaoModel,
    updatetentativaModel,
    selectperfilModel,
    coletarperfisgeralModel
};