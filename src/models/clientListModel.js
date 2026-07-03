const sequelize = require('../config/db');

const CLIENT_LIST_TABLE = String(process.env.CLIENT_LIST_TABLE || 'clientes_lista_aleatoria').trim();

class ClienteModel {
  async getClients(limit = 50) {
    const rows = await sequelize.query(
      `SELECT nome, email FROM \`${CLIENT_LIST_TABLE}\` LIMIT :limit`,
      {
        replacements: { limit: Number(limit) || 50 },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return rows.map((client) => ({
      email: client.email,
      name: client.nome,
    }));
  }
}

module.exports = new ClienteModel();