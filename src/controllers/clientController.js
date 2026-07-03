const path = require('path');
const ejs = require('ejs');
const brevo = require('../config/brevo');
const EmailLog = require('../models/emailLog');
const { getClients } = require('../models/clientListModel');
require('dotenv').config();

async function sendClientListEmails(req, res, next) {
  const { subject, link, limit = 50 } = req.body;

  try {
    const clients = await getClients(Number(limit));

    if (!clients.length) {
      return res.status(404).json({ success: false, message: 'No clients were found in the list.' });
    }

    const templatePath = path.join(__dirname, '../views/emailTemplates/welcome.ejs');
    const results = [];

    for (const client of clients) {
      const htmlContent = await ejs.renderFile(templatePath, {
        name: client.name || client.email,
        emailCliente: client.email,
        link,
      });

      const sendSmtpEmail = {
        sender: {
          email: process.env.SENDER_EMAIL,
          name: process.env.SENDER_NAME,
        },
        to: [{ email: client.email }],
        subject,
        htmlContent,
      };

      const response = await brevo.sendTransacEmail(sendSmtpEmail);

      await EmailLog.create({
        recipient: client.email,
        subject,
        status: 'success',
        messageId: response?.messageId || null,
      });

      results.push({ recipient: client.email, status: 'success' });
    }

    return res.status(200).json({
      success: true,
      message: 'Emails sent to the client list.',
      sent: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { sendClientListEmails };
