const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306');
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'sportshub_db';

  try {
    // 1. Connect without selecting database to create database if not existing
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    console.log('⚡ MySQL Server Connection Established.');
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    // 2. Read schema.sql, views.sql, seed.sql
    const databaseDir = path.join(__dirname, '../../database');
    const schemaPath = path.join(databaseDir, 'schema.sql');
    const viewsPath = path.join(databaseDir, 'views.sql');
    const seedPath = path.join(databaseDir, 'seed.sql');

    if (fs.existsSync(schemaPath)) {
      console.log('📌 Executing schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
    }

    if (fs.existsSync(viewsPath)) {
      console.log('📌 Executing views.sql...');
      const viewsSql = fs.readFileSync(viewsPath, 'utf8');
      await connection.query(viewsSql);
    }

    if (fs.existsSync(seedPath)) {
      console.log('🌱 Executing seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);

      // Hash default admin and user passwords securely
      const adminHash = await bcrypt.hash('admin123', 10);
      const userHash = await bcrypt.hash('user123', 10);

      await connection.query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [adminHash, 'admin@sportshub.com']
      );
      await connection.query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [userHash, 'user@sportshub.com']
      );
      await connection.query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [userHash, 'analyst@sportshub.com']
      );
      console.log('✅ Default User Credentials Updated:');
      console.log('   Admin -> admin@sportshub.com / admin123');
      console.log('   User  -> user@sportshub.com  / user123');
    }

    await connection.end();
    console.log('🚀 Database initialization completed successfully!\n');
    return true;
  } catch (error) {
    console.warn('⚠️ Automated MySQL initialization skipped or failed:', error.message);
    console.warn('💡 Ensure MySQL is running on port 3306 or update server/.env details.\n');
    return false;
  }
}

module.exports = { initDatabase };
