const senhaBanco = require('../dados/bancodedados')
const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query

    if (!senha_banco) {
        return res.status(401).json({ mensagem: 'Você precisa informar uma senha!' })
    }

    if (senha_banco !== senhaBanco.banco.senha) {
        return res.status(403).json({ mensagem: 'Senha Inválida' })
    }

    next()
}

module.exports = validarSenha