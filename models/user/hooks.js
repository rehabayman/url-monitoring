const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

/**
 * Hashes password for user either when newly added or
 * updated his password
 *
 * @param {object} next function that executes the middleware
 * succeeding the current middleware
 */
exports.hashPassword = function(next) {
  const user = this;

  if (user.isNew || user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
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
}
