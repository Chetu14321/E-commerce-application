const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    type: String
  },
  profileImage: {
  type: String,
  default: "", // store filename like "profile-12345.png"
},

  phone: {
    type: String
  },
  otp:{
    type:String,
    default:0
  }
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);
