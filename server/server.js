require('./config/config');

const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;

// Use BodyParser as middleware
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, resp) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc) => {
    resp.status(201).send(doc);
  }, (e) => {
    resp.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, resp) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    resp.send({todos});
  }, (e) => {
    resp.status(400).send(e);
  });
});

// GET /todos/{id}
// Validate ID using isValid
app.get('/todos/:id', authenticate, (req, resp) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return resp.status(404).send();
  }
  Todo.findOne({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
    if (!todo) {
      return resp.status(404).send();
    }
    resp.send({todo});
  }).catch(() => {
    resp.status(400).send();
  });
});

// DELETE /todos/{id}
app.delete('/todos/:id', authenticate, async (req, resp) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return resp.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
      });
    if (!todo) {
      return resp.status(404).send();
    }
    resp.send({todo});
  }
  catch (e) {
    resp.status(400).send();
  }
});

// PATCH /todos/{id}
app.patch('/todos/:id', authenticate, (req, resp) => {
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

  Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {$set: body}, {new: true})
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
app.post('/users', async (req, resp) => {
  const {email, password} = _.pick(req.body, ['email', 'password']);
  const user = new User({
    email,
    password
  });

  try {
    await user.save();
    var token = await user.generateAuthToken();
    resp.status(201).header('x-auth', token).send(user);
  }
  catch(e) {
    resp.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, resp) => {
  resp.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', async (req, resp) => {
  const body = _.pick(req.body, ['email', 'password']);

  try {
    var user = await User.findByCredentials(body.email, body.password);
    var token = await user.generateAuthToken();
    resp.status(200).header('x-auth', token).send(user);
  }
  catch(e) {
    resp.status(400).send();
  }
});

app.delete('/users/me/token', authenticate, async (req, resp) => {
  try {
    await req.user.removeToken(req.token);
    resp.status(200).send();
  }
  catch(e) {
    resp.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
