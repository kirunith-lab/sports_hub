const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { executeMockQuery } = require('./dbMock');
dotenv.config();

let useMock = false;
let pool = null;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sportshub_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    connectTimeout: 2000
  });
} catch (err) {
  useMock = true;
}

const query = async (sql, params) => {
  if (useMock) {
    return await executeMockQuery(sql, params);
  }

  try {
    return await pool.query(sql, params);
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'PROTOCOL_CONNECTION_LOST') {
      if (!useMock) {
        console.warn('⚠️ Local MySQL 8.0 server on port 3306 is not reachable.');
        console.warn('⚡ Automatically using in-memory relational fallback engine for seamless viva testing!\n');
        useMock = true;
      }
      return await executeMockQuery(sql, params);
    }
    throw err;
  }
};

const getConnection = async () => {
  if (useMock) {
    return {
      query: (sql, params) => executeMockQuery(sql, params),
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {}
    };
  }

  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    useMock = true;
    return {
      query: (sql, params) => executeMockQuery(sql, params),
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {}
    };
  }
};

module.exports = {
  query,
  getConnection
};
