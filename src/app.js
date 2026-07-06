const express = require('express');
const cors = require('cors');
require('dotenv').config();

const emailRoutes = require('./routes/emailRoutes');
const unsubscribeRoute = require('./routes/unsubscribeRoute');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use('/api/emails', emailRoutes);
app.use('/', unsubscribeRoute); // rota de descadastro disponível em /descadastro

app.use(errorHandler);

module.exports = app;
