var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var newTodo = new Todo({
  text: 'Cook dinner',
  completed: true,
  completedAt: 1234567890
});

newTodo.save().then((doc) => {
  console.log('Saved Todo', JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to save Todo', e);
});

// User
// email - required, trimmed, type to String, minlength = 1
// create new User

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var newUser = new User({
  email: 'test@test.com'
});
newUser.save().then((doc) => {
  console.log('Saved User', JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to save User', e);
});
