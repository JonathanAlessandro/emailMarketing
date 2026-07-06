const path = require('path');
const ejs = require('ejs');
const crypto = require('crypto');
const brevo = require('../config/brevo');
const EmailLog = require('../models/emailLog');
const Cliente = require('../models/cliente');
require('dotenv').config();

function gerarTokenDescadastro(clienteId) {
  return crypto.createHash('sha256')
    .update(`${clienteId}-${process.env.UNSUBSCRIBE_SECRET}`)
    .digest('hex');
}

async function sendEmail(req, res, next) {
  const { recipient, subject, name, link, clienteId } = req.body;

  try {
    const templatePath = path.join(__dirname, '../views/emailTemplates/welcome.ejs');
    // Gera o link de descadastro específico desse cliente
    const token = gerarTokenDescadastro(clienteId);
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const linkDescadastro = `${baseUrl}/descadastro?token=${token}&id=${clienteId}`;

    // Armazena o token no banco para validação segura de descadastro
    if (clienteId) {
      const cliente = await Cliente.findByPk(clienteId);
      if (cliente) {
        await cliente.update({ unsubscribeToken: token });
      }
    }

    const htmlContent = await ejs.renderFile(templatePath, {
      name,
      link,
      emailCliente: recipient,
      signOutLink: linkDescadastro,
    });

    const sendSmtpEmail = {
      sender: {
        email: process.env.SENDER_EMAIL || 'demo@example.com',
        name: process.env.SENDER_NAME || 'Demo Sender',
      },
      to: [{ email: recipient }],
      subject,
      htmlContent,
      headers: {
        'List-Unsubscribe': `<${linkDescadastro}>, <mailto:descadastro@libertysaude.com.br>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    };

    const response = await brevo.sendTransacEmail(sendSmtpEmail);

    await EmailLog.create({
      recipient,
      subject,
      status: 'success',
      messageId: response?.messageId || null,
    });

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: response,
    });
  } catch (error) {
    await EmailLog.create({
      recipient,
      subject,
      status: 'failed',
      error: error.message,
    });

    next(error);
  }
}

module.exports = { sendEmail };