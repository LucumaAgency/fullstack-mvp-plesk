const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

app.get('/api/notes', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM notes');
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('INSERT INTO notes (content) VALUES (?)', [content]);
    await connection.end();
    res.status(201).json({ message: 'Note created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Para Phusion Passenger en Plesk
if (typeof(PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
} else {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
