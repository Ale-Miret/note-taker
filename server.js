const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the public folder as a static directory
app.use(express.static('public'));

// API routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  const newNote = req.body;
  newNote.id = uuidv4();
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  const updatedNotes = notes.filter(note => note.id !== req.params.id);
  fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes));
  res.sendStatus(204);
});

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// If no matching route is found, default to home
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

