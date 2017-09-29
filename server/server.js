const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// Use BodyParser as middleware
app.use(bodyParser.json());

app.post('/todos', (req, resp) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    resp.status(201).send(doc);
  }, (e) => {
    resp.status(400).send(e);
  });
});

app.get('/todos', (req, resp) => {
  Todo.find().then((todos) => {
    resp.send({todos});
  }, (e) => {
    resp.status(400).send(e);
  });
})

// GET /todos/{id}
// Validate ID using isValid
app.get('/todos/:id', (req, resp) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return resp.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return resp.status(404).send();
    }
    resp.send({todo});
  }).catch(() => {
    resp.status(400).send();
  });
})

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
