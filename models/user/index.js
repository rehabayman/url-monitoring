const mongoose = require('mongoose');
const {hashPassword} = require('./hooks');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationLink: {
    type: String,
  },

  checks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Check',
  }],

}, {
  timestamps: true,
});

userSchema.pre('save', hashPassword);

const User = mongoose.model('User', userSchema);

exports.User = User;
