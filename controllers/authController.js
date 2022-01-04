const {validateUser} = require('../validations/userValidator');
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../services/authService');
const {sendEmail} = require('../services/emailService');

exports.signup = async (req, res) => {
  const {error} = validateUser(req.body);

  if (error) res.status(400).send({message: error.details[0].message});

  const user = await User.findOne({email: req.body.email});

  if (user) {
    res.status(400).send({message: 'user already registered'});
  }

  let newUser = new User({
    name: req.body.name, email: req.body.email, password: req.body.password,
  });

  try {
    newUser = await newUser.save();

    sendEmail(newUser._id, newUser.email);

    const token = generateToken(newUser.id);

    const data = {
      accessToken: token,
    };

    res.status(201).send({
      data,
      message: 'Registered Successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({message: err});
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const {id} = jwt.verify(req.query.token, process.env.EMAIL_SECRET, {
      expiresIn: 86400, // 1 day in seconds [24 hours]
    });
    await User.updateOne({_id: id}, {isVerified: true});
    res.status(200).send({
      message: 'Mail Verified Successfully. You can Login Now.',
    });
  } catch (err) {
    res.status(400).send({message: err});
  }
};

exports.signin = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).send({
        message: 'Invalid Email or Password',
      });
    }

    if (!user.isVerified) {
      return res.status(400).send({
        message: 'Email is not verified',
      });
    }

    // check password matching
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(400).send({
        message: 'Invalid Email or Password',
      });
    }

    // assign the three parts ot the token
    const token = generateToken(user.id);

    res.status(200).send({
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({
      message: 'Server Error',
    });
  }
};
