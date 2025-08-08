const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST || 'localhost');
  console.log('  User:', process.env.DB_USER || 'root');
  console.log('  Database:', process.env.DB_NAME || 'fullstack_db');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fullstack_db'
    });
    
    console.log('Connected successfully!');
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Query test successful:', rows);
    
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\nTrying to create database...');
      try {
        const conn = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || ''
        });
        
        await conn.execute('CREATE DATABASE IF NOT EXISTS ' + (process.env.DB_NAME || 'fullstack_db'));
        console.log('Database created successfully!');
        
        await conn.end();
      } catch (createError) {
        console.error('Failed to create database:', createError.message);
      }
    }
  }
}

testConnection();