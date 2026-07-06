const crypto = require('crypto');
const Cliente = require('../models/cliente');

function gerarTokenDescadastro(clienteId) {
  return crypto.createHash('sha256')
    .update(`${clienteId}-${process.env.UNSUBSCRIBE_SECRET}`)
    .digest('hex');
}

async function descadastrar(req, res) {
  const token = req.query.token || req.body.token;
  const id = req.query.id || req.body.id;

  if (!token || !id) {
    return res.status(400).send('Dados de descadastro inválidos');
  }

  // Validação segura usando o token armazenado no banco.
  // O token tem 64 caracteres hex e deve corresponder ao valor salvo no campo unsubscribe_token.
  const cliente = await Cliente.findOne({ where: { id, unsubscribeToken: token } });

  if (!cliente) {
    return res.status(400).send('Link inválido ou token expirado');
  }

  await cliente.update({ aceitaEmail: false, unsubscribeToken: null });
  res.status(200).send('Você foi descadastrado com sucesso.');
}

module.exports = { descadastrar };