const express = require('express');
const { descadastrar } = require('../controllers/descadastroController');

const router = express.Router();

router.get('/descadastro', descadastrar);   // clique manual no link do e-mail
router.post('/descadastro', descadastrar);  // clique "one-click" feito pelo Gmail/Outlook

module.exports = router;