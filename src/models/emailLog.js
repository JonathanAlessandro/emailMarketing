const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmailLog = sequelize.define('EmailLog', {
  recipient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('success', 'failed'),
    allowNull: false,
  },
  messageId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'email_logs',
  timestamps: true,
});

module.exports = EmailLog;
