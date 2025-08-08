const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fullstack_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM notes ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO notes (content) VALUES (?)',
      [content]
    );
    
    res.status(201).json({ 
      message: 'Note created successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to create note', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Passenger
module.exports = app;