const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

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

  checks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Check',
  }],

}, {
  timestamps: true,
});

userSchema.pre('save', function(next) {
  const user = this;

  if (user.isNew || user.isModified('password')) {
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      if (err) {
        console.log(err);
        return next('Cannot Add/Update User');
      } else {
        user.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

exports.User = User;
