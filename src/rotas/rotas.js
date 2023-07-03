const express = require('express')
const { obterContas, criarConta, atualizarConta, excluirConta, depositar, sacar, transferir, saldo, extrato } = require('../controladores/controladores')
const validarSenha = require('../middlewares/validadorSenha')

const rotas = express()

rotas.post('/contas', criarConta)
rotas.put('/contas/:numeroConta/usuario', atualizarConta)
rotas.delete('/contas/:numeroConta', excluirConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
rotas.get('/contas/saldo/:numero_conta/:senha', saldo)
rotas.get('/contas/extrato/:numero_conta/:senha', extrato)

rotas.use(validarSenha)
rotas.get('/contas', validarSenha, obterContas)

module.exports = rotas