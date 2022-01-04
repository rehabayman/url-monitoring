const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_SECRET = process.env.EMAIL_SECRET;

exports.generateToken = (userId) => {
  // assign the three parts ot the token
  const token = jwt.sign({id: userId}, JWT_SECRET, {
    expiresIn: 172800, // 8 hours
  });

  return token;
};

exports.compareUserPassword = (loginPassword, userPassword) => {
  return bcrypt.compareSync(loginPassword, userPassword);
};

exports.verifyJwtToken = (token) => {
  const {id} = jwt.verify(token, EMAIL_SECRET);
  return id;
};
