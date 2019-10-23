'use strict'

const express = require('express');

const app = express();

let db = [];

app.use(express.json());

function middlewareTime(req, res, next) {
  req.requestTime = Date.now();
  next();
}

app.use('*', middlewareTime)

function middlewareMessage(message) {
  return function(req, res, next) {
    console.log(`${req.requestTime} ${req.path} ${message}`);
    next();
  }
}

function middlewarePost(req, res, next) {
  req.valid = Math.random() >= 0.5;
  next();
}

// Route to Get All Categories
app.get('/categories', middlewareMessage('Test Message from app.get on categories'), (req, res, next) => {
// app.get('/categories', (req, res, next) => {
  let count = db.length;
  let results = db;
  res.json({ count, results });
});

// Route to Create a Category
app.post('/categories', middlewarePost, middlewareMessage('Test Message from app.post on categories'), (req, res, next) => {
  if(!req.valid){
    throw 'Request is not valid'
  }
  let record = req.body;
  record.id = Math.random();
  db.push(record);
  res.json(record);
  
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})


module.exports = {
    app,
    start: () => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('Server Listening')
        })
    }
}