const path = require('path');
const ejs = require('ejs');
const brevo = require('../config/brevo');
const EmailLog = require('../models/emailLog');
require('dotenv').config();

async function sendEmail(req, res, next) {
  const { recipient, subject, name, link } = req.body;

  try {
    const templatePath = path.join(__dirname, '../views/emailTemplates/welcome.ejs');
    const htmlContent = await ejs.renderFile(templatePath, { name, link });

    const sendSmtpEmail = {
      sender: {
        email: process.env.SENDER_EMAIL || 'demo@example.com',
        name: process.env.SENDER_NAME || 'Demo Sender',
      },
      to: [{ email: recipient }],
      subject,
      htmlContent,
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
