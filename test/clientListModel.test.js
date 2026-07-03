const test = require('node:test');
const assert = require('node:assert/strict');

const { detectCandidateColumn, normalizeColumnName } = require('../src/models/clientListModel');

test('normalizeColumnName converts names to a comparable format', () => {
  assert.equal(normalizeColumnName('Nome do Cliente'), 'nome_do_cliente');
});

test('detectCandidateColumn selects the best matching name column', () => {
  const columns = {
    email: {},
    nome_cliente: {},
    cliente: {},
  };

  assert.equal(detectCandidateColumn(columns, ['nome', 'name', 'cliente', 'nome_cliente']), 'nome_cliente');
});
