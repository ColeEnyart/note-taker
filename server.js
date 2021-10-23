const express = require('express');
const path = require('path');
const data = require('./db/db.json');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

let globalData = data;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

/* app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
); */

app.get('/api/notes', (req, res) => {
    res.status(200).json(globalData);
});

app.post('/api/notes', (req, res) => {
    let currData = req.body;
    currData.id = uuidv4();

    globalData.push(currData);

    fs.writeFile('./db/db.json', JSON.stringify(globalData), (err) => {
        err ? console.error(err) : console.log('Success!')
    });

    res.json(globalData);
});

app.delete('/api/notes/:id', (req, res) => {
    let toDeleteId = req.params.id;
    globalData = globalData.filter(note => note.id != toDeleteId);
  
    fs.writeFile('./db/db.json', JSON.stringify(globalData), (err) =>{
      err ? console.error(err) : console.log('Success!')}
    );
  
    res.status(200).json(globalData);
  })

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);