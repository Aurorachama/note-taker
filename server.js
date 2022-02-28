const express = require('express');
const path = require('path');
const fs = require('fs');
//unique id generated by nanoid package
const {nanoid} = require("nanoid");
const note = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

//reduce the id to 4 (pass as an argument), and transfer all letters to lower case
const uid = nanoid(4).toLowerCase();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req,res) => {
    res.json(note);
    console.log(`${req.method} request received to ${req.method} note`);
});

app.post('/api/notes', (req,res) => {
    req.body.id = uid;
    const noteToAdd = req.body;
    note.push(noteToAdd);
    fs.writeFileSync(path.join(__dirname,'/db/db.json'),
    JSON.stringify(note)
    ); //change
    res.json(`${req.method} request received to ${req.method} note`);
    console.log(`${req.method} request received to ${req.method} note`);

});

app.delete('/api/notes/:id', (req, res) => {
    const {id} = req.params;
    const delIndex = note.findIndex(p => p.id == id);
    note.splice(delIndex, 1);
   
    fs.writeFileSync(
      path.join(__dirname, '/db/db.json'), 
      JSON.stringify(note)
    );
    //update the db.json file
    res.json(`${req.method} request received to ${req.method} ${delIndex} note`);
    console.log(`${req.method} request received to ${req.method} ${delIndex} note`);
  });

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App live: http://localhost:3001`);
});