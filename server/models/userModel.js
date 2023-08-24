const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    },
  password: {
    type: String,
    required: true
  },
  firstname:{
    type: String,
    // required: true
  },
  lastname:{
    type: String,
    
  },
  role: {
    type: String,
    default: 'basic',
    enum: ["basic", "agent", "admin"]
  },
  accessToken: {
    type: String
  }
})

const User = mongoose.model('user', UserSchema)

module.exports = User;