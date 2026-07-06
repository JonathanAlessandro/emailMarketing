const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CLIENT_LIST_TABLE = process.env.CLIENT_LIST_TABLE || 'clientes_lista_aleatoria';

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  aceitaEmail: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'aceita_email',
  },
  unsubscribeToken: {
    type: DataTypes.STRING(64),
    allowNull: true,
    field: 'unsubscribe_token',
  },
}, {
  tableName: CLIENT_LIST_TABLE,
  timestamps: false,
});

module.exports = Cliente;
