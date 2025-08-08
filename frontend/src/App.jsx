import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await axios.get(`${API_URL}/notes`);
    setNotes(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/notes`, { content });
    setContent('');
    fetchNotes();
  };

  return (
    <div className="container">
      <h1>Notes App</h1>
      <div className="input-group">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a note..."
        />
        <button onClick={handleSubmit}>Add Note</button>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
