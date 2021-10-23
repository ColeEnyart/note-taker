const express = require('express');
const path = require('path');
const data = require('./db/db.json');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Use port 3001 or a dynamic port
const PORT = process.env.PORT || 3001;

const app = express();

// Global variable to hold data
let globalData = data;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Send to index page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

// Send to notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

// Get saved notes
app.get('/api/notes', (req, res) => {
    res.json(globalData);
});

// Save new note
app.post('/api/notes', (req, res) => {
    let currData = req.body;
    currData.id = uuidv4();

    globalData.push(currData);

    fs.writeFile('./db/db.json', JSON.stringify(globalData), (err) => {
        err ? console.error(err) : console.log('Success!')
    });

    res.json(globalData);
});

// bonus ability to delete notes
app.delete('/api/notes/:id', (req, res) => {
    let toDeleteId = req.params.id;
    globalData = globalData.filter(note => note.id != toDeleteId);
  
    fs.writeFile('./db/db.json', JSON.stringify(globalData), (err) =>{
      err ? console.error(err) : console.log('Success!')}
    );
  
    res.json(globalData);
  })

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);