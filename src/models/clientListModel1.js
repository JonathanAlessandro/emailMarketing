const sequelize = require('../config/db');

const CLIENT_LIST_TABLE = process.env.CLIENT_LIST_TABLE ;

function normalizeColumnName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function detectCandidateColumn(columns, candidates = []) {
  const normalizedColumns = Object.keys(columns).map((column) => normalizeColumnName(column));
  const candidateSet = new Set(candidates.map((candidate) => normalizeColumnName(candidate)));

  for (const column of normalizedColumns) {
    if (candidateSet.has(column)) {
      return column;
    }
  }

  return normalizedColumns.find((column) => column.includes('email')) || null;
}

async function getRandomClients(limit = 50) {
  const queryInterface = sequelize.getQueryInterface();
  const tableColumns = await queryInterface.describeTable(CLIENT_LIST_TABLE);

  const emailColumn = detectCandidateColumn(tableColumns, ['email']);
  const nameColumn = detectCandidateColumn(tableColumns, ['nome']);

  if (!emailColumn) {
    throw new Error(`No email column found in table ${CLIENT_LIST_TABLE}`);
  }

  const selectColumns = [emailColumn];
  if (nameColumn && nameColumn !== emailColumn) {
    selectColumns.push(nameColumn);
  }

  const clients = await sequelize.query(
    `SELECT ${selectColumns.join(', ')} FROM ${CLIENT_LIST_TABLE} LIMIT :limit`,
    {
      replacements: { limit },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return clients.map((client) => ({
    email: client[emailColumn],
    name: nameColumn ? client[nameColumn] : null,
  }));
}

module.exports = {
  CLIENT_LIST_TABLE,
  normalizeColumnName,
  detectCandidateColumn,
  getRandomClients,
};
