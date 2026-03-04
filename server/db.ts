import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('attendance.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS empresas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    raio_permitido INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'EMPLOYEE',
    empresa_id INTEGER,
    FOREIGN KEY (empresa_id) REFERENCES empresas (id)
  );

  CREATE TABLE IF NOT EXISTS pontos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    data_hora TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'VALIDO',
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
  );

  CREATE TABLE IF NOT EXISTS auditoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    empresa_id INTEGER,
    acao TEXT NOT NULL,
    detalhes TEXT,
    data_hora TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    FOREIGN KEY (empresa_id) REFERENCES empresas (id)
  );
`);

// Insert mock data
const empresaCount = db.prepare('SELECT COUNT(*) as count FROM empresas').get() as {count: number};
if (empresaCount.count === 0) {
  const insertEmpresa = db.prepare('INSERT INTO empresas (nome, latitude, longitude, raio_permitido) VALUES (?, ?, ?, ?)');
  // Example: Googleplex coordinates
  const empresaId = insertEmpresa.run('Tech Corp', 37.4220936, -122.083922, 1000).lastInsertRowid;

  const insertUsuario = db.prepare('INSERT INTO usuarios (nome, email, senha, role, empresa_id) VALUES (?, ?, ?, ?, ?)');
  insertUsuario.run('Admin', 'admin@techcorp.com', 'admin123', 'ADMIN', empresaId);
  insertUsuario.run('João Silva', 'joao@techcorp.com', 'joao123', 'EMPLOYEE', empresaId);
  insertUsuario.run('Maria Souza', 'maria@techcorp.com', 'maria123', 'EMPLOYEE', empresaId);
}

export default db;
