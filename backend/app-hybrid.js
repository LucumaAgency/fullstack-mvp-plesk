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

// In-memory storage as fallback
let memoryNotes = [
  { id: 1, content: 'Sample note 1', created_at: new Date().toISOString() },
  { id: 2, content: 'Sample note 2', created_at: new Date().toISOString() }
];
let nextId = 3;
let useDatabase = false;
let pool = null;

// Try to create database connection pool
const initDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fullstack_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000
    });
    
    // Test the connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    useDatabase = true;
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Falling back to in-memory storage');
    useDatabase = false;
    return false;
  }
};

// Initialize database on startup
initDatabase();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = useDatabase ? 'connected' : 'using-memory';
  res.json({ 
    status: 'OK',
    database: dbStatus,
    mode: useDatabase ? 'database' : 'in-memory',
    timestamp: new Date().toISOString()
  });
});

// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    if (useDatabase && pool) {
      try {
        const [rows] = await pool.execute('SELECT * FROM notes ORDER BY created_at DESC');
        res.json(rows);
      } catch (dbError) {
        console.error('Database query failed:', dbError.message);
        // Fall back to memory
        useDatabase = false;
        res.json(memoryNotes);
      }
    } else {
      res.json(memoryNotes);
    }
  } catch (error) {
    console.error('Error in /api/notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes', details: error.message });
  }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    if (useDatabase && pool) {
      try {
        const [result] = await pool.execute(
          'INSERT INTO notes (content) VALUES (?)',
          [content]
        );
        res.status(201).json({ 
          message: 'Note created successfully',
          id: result.insertId 
        });
      } catch (dbError) {
        console.error('Database insert failed:', dbError.message);
        // Fall back to memory
        useDatabase = false;
        const newNote = {
          id: nextId++,
          content: content,
          created_at: new Date().toISOString()
        };
        memoryNotes.push(newNote);
        res.status(201).json({ 
          message: 'Note created successfully (in memory)',
          id: newNote.id 
        });
      }
    } else {
      const newNote = {
        id: nextId++,
        content: content,
        created_at: new Date().toISOString()
      };
      memoryNotes.push(newNote);
      res.status(201).json({ 
        message: 'Note created successfully (in memory)',
        id: newNote.id 
      });
    }
  } catch (error) {
    console.error('Error in POST /api/notes:', error);
    res.status(500).json({ error: 'Failed to create note', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Export for Passenger
module.exports = app;