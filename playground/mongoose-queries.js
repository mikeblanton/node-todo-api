const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// var id = '59cdada73b985531435eb2aa';
//
// ObjectID.isValid(id) ? console.log('ID is valid') : console.log('ID is not valid');

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

// Query Users
// User.findById
// No user, user found, error
var userId = '59cd8cb9403182d63f9f289f';
User.findById(userId).then((user) => {
  if (!user) {
    return console.log('Id not found');
  }
  console.log('User By Id', user);
}).catch((e) => console.log(e));
