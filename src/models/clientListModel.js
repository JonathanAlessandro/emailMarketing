const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CLIENT_LIST_TABLE = process.env.CLIENT_LIST_TABLE;

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: CLIENT_LIST_TABLE,
});

class ClienteModel {
  async selectAllClients() {
    return await Cliente.findAll();
  }

  async selectClientById(id) {
    return await Cliente.findByPk(id);
  }

  async selectClientsByStatus(status) {
    return await Cliente.findAll({ where: { status } });
  }

  async getClients(limit = 50) {
    const clients = await Cliente.findAll({
      attributes: ['email', 'nome'],
      where: { status: 'ATIVO' },
      limit,
    });

    return clients.map((client) => ({
      email: client.email,
      name: client.nome,
    }));
  }

  async insertClient(client) {
    return await Cliente.create(client);
  }

  async updateClient(id, client) {
    return await Cliente.update(client, { where: { id } });
  }

  async deleteClient(id) {
    return await Cliente.destroy({ where: { id } });
  }
}

module.exports = new ClienteModel();