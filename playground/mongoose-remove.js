const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
 
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove
Todo.findByIdAndRemove('59cea8d4b9a2664c95d63fa5').then((todo) => {
  console.log(todo);
});
