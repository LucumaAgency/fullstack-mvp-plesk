const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// In-memory storage for testing
let notes = [
  { id: 1, content: 'Sample note 1', created_at: new Date().toISOString() },
  { id: 2, content: 'Sample note 2', created_at: new Date().toISOString() }
];
let nextId = 3;

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mode: 'in-memory',
    timestamp: new Date().toISOString() 
  });
});

// Get all notes
app.get('/api/notes', async (req, res) => {
  res.json(notes);
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Content is required' });
  }

  const newNote = {
    id: nextId++,
    content: content,
    created_at: new Date().toISOString()
  };
  
  notes.push(newNote);
  
  res.status(201).json({ 
    message: 'Note created successfully',
    id: newNote.id 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Passenger
module.exports = app;