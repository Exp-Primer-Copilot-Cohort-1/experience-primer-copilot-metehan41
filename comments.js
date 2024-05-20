// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the database
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/comments';
var db;
MongoClient.connect(url, function(err, database) {
  if (err) {
    console.log('Error connecting to database. Exiting.');
    process.exit(1);
  }
  db = database;
});

// Create a new comment
app.post('/comments', function(req, res) {
  var comment = req.body;
  db.collection('comments').insertOne(comment, function(err, result) {
    if (err) {
      console.log('Error inserting comment into database');
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

// Get all comments
app.get('/comments', function(req, res) {
  db.collection('comments').find({}).toArray(function(err, result) {
    if (err) {
      console.log('Error getting comments from database');
      res.sendStatus(500);
    } else {
      res.send(result);
    }
  });
});

// Start the server
app.listen(3000, function() {
  console.log('Server listening on port 3000');
});