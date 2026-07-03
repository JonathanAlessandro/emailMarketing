const express = require('express');
const { validateSendEmail } = require('../middlewares/validation');
const { sendEmail } = require('../controllers/emailController');
const { sendClientListEmails } = require('../controllers/clientController');

const router = express.Router();

router.post('/send', validateSendEmail, sendEmail);
router.post('/send-client-list', sendClientListEmails);

module.exports = router;
