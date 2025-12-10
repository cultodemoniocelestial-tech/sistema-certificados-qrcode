const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'certificados.db');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
  }
});

// Criar tabela de certificados
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS certificados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo VARCHAR(255) UNIQUE NOT NULL,
      aluno VARCHAR(255) NOT NULL,
      curso VARCHAR(255) NOT NULL,
      carga_horaria VARCHAR(100),
      data_emissao VARCHAR(100),
      url_validacao VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'ativo',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela:', err.message);
    } else {
      console.log('✅ Tabela "certificados" criada/verificada com sucesso');
    }
  });
});

module.exports = db;
