const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  url: {
    type: String,
    required: true,
  },

  protocol: {
    type: String,
    required: true,
  },

  path: {
    type: String,
  },

  port: {
    type: Number,
  },

  webhook: {
    type: String,
  },

  timeout: {
    type: Number,
    default: 5,
  },

  interval: {
    type: Number,
    default: 10,
  },

  threshold: {
    type: Number,
    default: 1,
  },

  authentication: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },

  assert: {
    statusCode: {
      type: Number,
    },
  },

  ignoreSSL: {
    type: Boolean,
    default: true,
  },

  config: {
    intervalUnits: {
      type: String,
      default: 'minutes',
    },
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  status: {
    type: String,
  },

  tags: [
    {
      type: String,
    },
  ],

}, {
  timestamps: true,
});

const Check = mongoose.model('Check', checkSchema);

exports.Check = Check;
