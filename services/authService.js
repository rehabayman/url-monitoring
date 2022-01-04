const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = (userId) => {
  // assign the three parts ot the token
  const token = jwt.sign({id: userId}, JWT_SECRET, {
    expiresIn: 172800, // 8 hours
  });

  return token;
};
