require('./config/config');

const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT;

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
});

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
});

// DELETE /todos/{id}
app.delete('/todos/:id', (req, resp) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return resp.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return resp.status(404).send();
    }
    resp.send({todo});
  }).catch(() => {
    resp.status(400).send();
  });
});

// PATCH /todos/{id}
app.patch('/todos/:id', (req, resp) => {
  var id = req.params.id;
  // User can only update text and completed
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return resp.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((todo) => {
      if (!todo) {
        return resp.status(404).send();
      }

      resp.send({todo});
    })
    .catch((e) => {
      resp.status(400).send();
    });
});

// POST /users
app.post('/users', (req, resp) => {
  var {email, password} = _.pick(req.body, ['email', 'password']);
  var user = new User({
    email,
    password
  });

  user.save().then(() => {
    return user.generateAuthToken();
  })
  .then((token) => {
    resp.status(201).header('x-auth', token).send(user);
  })
  .catch((e) => {
    resp.status(400).send(e);
  });
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
