const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// Create Shema
const UserSchema = new Schema({
  googleID:{
    type:String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  location: {
    type: String,
    default: 'N/A'
  },
  birthDate: {
    type: Date
  },
  website: {
    type: String,
    default: 'N/A'
  },
  about: {
    type: String,
    default: 'N/A'
  } 
});

// Apply the uniqueValidator plugin to userSchema.
UserSchema.plugin(uniqueValidator);

// Create collection and add schema
mongoose.model('users', UserSchema);