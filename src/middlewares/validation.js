const validator = require('validator');

function validateSendEmail(req, res, next) {
  const { recipient, subject, name, link } = req.body;

  if (!recipient || !validator.isEmail(recipient)) {
    return res.status(400).json({ success: false, message: 'A valid recipient email is required.' });
  }

  if (!subject || subject.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'A subject is required.' });
  }

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'A name is required.' });
  }

  if (!link || !validator.isURL(link)) {
    return res.status(400).json({ success: false, message: 'A valid link is required.' });
  }

  next();
}

module.exports = { validateSendEmail };
