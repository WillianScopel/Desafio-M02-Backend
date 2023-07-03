const { contas, saques, depositos, transferencias } = require('../dados/bancodedados')
let identificador = 1
const { format } = require('date-fns')

const obterContas = (req, res) => {
    res.status(200).json(contas)
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!validarInformacoesDaConta(nome, cpf, data_nascimento, telefone, email, senha)) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })
    }

    const verificarCpfExistente = verificarCpfNosDados(cpf)

    const verificarEmailExistente = verificarEmailNosDados(email)

    if (verificarCpfExistente || verificarEmailExistente) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado!' })
    }

    const novaConta = {
        numero: identificador,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novaConta)
    identificador++
    return res.status(201).json()
}

const atualizarConta = (req, res) => {
    const numeroDaConta = Number(req.params.numeroConta)
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const indiceEncontrado = encontrarIndiceDoUsuario(numeroDaConta)
    const verificarCpfExistente = verificarCpfNosDados(cpf)
    const verificarEmailExistente = verificarEmailNosDados(email)

    if (isNaN(numeroDaConta) || indiceEncontrado === -1) {
        return res.status(400).json({ mensagem: 'O numero da conta não é válido ou não existe!' })
    }

    const dadosValidos = validarInformacoesDaConta(nome, cpf, data_nascimento, telefone, email, senha)

    if (!dadosValidos) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })
    }

    if (verificarCpfExistente && contas[indiceEncontrado].usuario.cpf != cpf) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf informado!' })
    }

    if (verificarEmailExistente && contas[indiceEncontrado].usuario.email != email) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o email informado!' })
    }

    contas[indiceEncontrado] = {
        ...contas[indiceEncontrado],
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    return res.status(204).json()
}

const excluirConta = (req, res) => {
    const numeroDaConta = Number(req.params.numeroConta)
    const indiceEncontrado = encontrarIndiceDoUsuario(numeroDaConta)

    if (isNaN(numeroDaConta) || indiceEncontrado === -1) {
        return res.status(400).json({ mensagem: 'O numero da conta não é válido ou não existe!' })
    }

    if (contas[indiceEncontrado].saldo != 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' })
    }

    contas.splice(indiceEncontrado, 1)

    return res.status(200).json()
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
    }

    const indiceConta = encontrarIndiceDoUsuario(Number(numero_conta))
    let saldoDaConta = contas[indiceConta].saldo

    const verificarConta = verificarSeContaExiste(numero_conta)

    if (!verificarConta) {
        return res.status(400).json({ mensagem: "A conta informada não existe" })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor precisa ser positivo" })
    }

    contas[indiceConta] = {
        ...contas[indiceConta],
        saldo: saldoDaConta + valor
    }

    depositos.push({
        data: format(new Date(), 'yyyy-mm-dd kk:mm:ss'),
        numero_conta,
        valor
    })


    return res.status(204).json()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    const verificarConta = verificarSeContaExiste(numero_conta)
    const indiceConta = encontrarIndiceDoUsuario(Number(numero_conta))
    let saldoDaConta = contas[indiceConta].saldo

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" })
    }

    if (!verificarConta) {
        return res.status(400).json({ mensagem: "A conta informada não existe" })
    }

    if (contas[indiceConta].usuario.senha != senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor ou igual a zero!" })
    }

    if (contas[indiceConta].saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" })
    }

    contas[indiceConta] = {
        ...contas[indiceConta],
        saldo: saldoDaConta - valor
    }

    saques.push({
        data: format(new Date(), 'yyyy-mm-dd kk:mm:ss'),
        numero_conta,
        valor
    })

    return res.status(204).json()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
    const verificarContaOrigem = verificarSeContaExiste(numero_conta_origem)
    const verificarContaDestino = verificarSeContaExiste(numero_conta_destino)
    const indiceContaOrigem = encontrarIndiceDoUsuario(Number(numero_conta_origem))
    const indiceContaDestino = encontrarIndiceDoUsuario(Number(numero_conta_destino))
    let saldoDaContaOrigem = contas[indiceContaOrigem].saldo
    let saldoDaContaDestino = contas[indiceContaDestino].saldo

    if (!numero_conta_destino || !numero_conta_origem || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }

    if (!verificarContaDestino || !verificarContaOrigem) {
        return res.status(400).json({ mensagem: "A conta de destino ou de origem não existe" })
    }

    if (contas[indiceContaOrigem].usuario.senha != senha) {
        return res.status(400).json({ mensagem: "Senha incorreta!" })
    }

    if (valor > contas[indiceContaOrigem].saldo) {
        return res.status(400).json({ mensagem: "Sem saldo suficiente para tranferir." })
    }

    contas[indiceContaOrigem] = {
        ...contas[indiceContaOrigem],
        saldo: saldoDaContaOrigem - valor
    }

    contas[indiceContaDestino] = {
        ...contas[indiceContaDestino],
        saldo: saldoDaContaDestino + valor
    }

    transferencias.push({
        data: format(new Date(), 'yyyy-mm-dd kk:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    })

    return res.status(204).json()
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.params
    const indiceConta = encontrarIndiceDoUsuario(Number(numero_conta))
    const verificarConta = verificarSeContaExiste(numero_conta)
    const saldoConta = contas[indiceConta].saldo

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios!" })
    }

    if (!verificarConta) {
        return res.status(400).json({ mensagem: "Conta bancária não encontada!" })
    }

    if (contas[indiceConta].usuario.senha != senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' })
    }

    return res.status(200).json({ Saldo: saldoConta })

}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.params
    const indiceConta = encontrarIndiceDoUsuario(Number(numero_conta))

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios!" })
    }

    if (!verificarSeContaExiste(numero_conta)) {
        return res.status(400).json({ mensagem: "Conta bancária não encontada!" })
    }

    if (contas[indiceConta].usuario.senha != senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' })
    }

    const depositosConta = depositos.filter((deposito) => { return deposito.numero_conta == numero_conta })

    const saquesConta = saques.filter((saque) => { return saque.numero_conta == numero_conta })

    const transferenciasEnviadas = transferencias.filter((transferencia) => { return transferencia.numero_conta_origem == numero_conta })

    const transferenciasRecebidas = transferencias.filter((transferencia) => { return transferencia.numero_conta_destino == numero_conta })

    return res.status(200).json({ depositos: depositosConta, saques: saquesConta, transferenciasEnviadas: transferenciasEnviadas, transferenciasRecebidas: transferenciasRecebidas })
}

const validarInformacoesDaConta = (nome, cpf, data_nascimento, telefone, email, senha) => {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return false
    }

    return true
}

const verificarEmailNosDados = (email) => {
    const verificarEmailExistente = contas.find((conta) => { return conta.usuario.email === email })

    return verificarEmailExistente
}

const verificarCpfNosDados = (cpf) => {
    const verificarCpfExistente = contas.find((conta) => { return conta.usuario.cpf === cpf })

    return verificarCpfExistente
}

const encontrarIndiceDoUsuario = (numero) => {
    const indiceEncontrado = contas.findIndex((conta) => { return conta.numero === numero; })

    return indiceEncontrado
}

const verificarSeContaExiste = (numero) => {
    const verificarConta = contas.find((conta) => { return conta.numero == numero })
    return verificarConta
}

module.exports = {
    obterContas,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}