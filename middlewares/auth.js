const jwt = require('jsonwebtoken');
const {getUserById} = require('../services/userService');
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({message: 'unauthorized'});
      }

      req.user = decoded;
      next();
    });
  } else {
    return res.status(403).send({message: 'no token provided'});
  }
};

exports.userVerified = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const {id} = jwt.verify(token, JWT_SECRET);
      const user = await getUserById(id);

      if (!user.isVerified) {
        return res.status(403).send({message: 'email is not verified'});
      }

      next();
    } catch (err) {
      return res.status(403).send();
    }
  } else {
    return res.status(403).send({message: 'no token provided'});
  }
};
