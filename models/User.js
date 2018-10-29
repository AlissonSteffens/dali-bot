const mongoose = require('../config/mongoConnection');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  last: String,
  
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
