const {validateUser} = require('../validations/userValidator');
const {
  generateToken, compareUserPassword,
  verifyJwtToken,
} = require('../services/authService');
const {sendEmail} = require('../services/emailService');
const {
  createUser, getUserByEmail,
  updateUser,
} = require('../services/userService');
const {
  validateResendVerificationLink,
  validateSignIn,
  validateVerifyEmail,
} = require('../validations/authValidator');

exports.signup = async (req, res) => {
  const {error} = validateUser(req.body);

  if (error) return res.status(400).send({message: error.details[0].message});

  const {email, name, password} = req.body;

  try {
    const user = await getUserByEmail(email);

    if (user) {
      return res.status(400).send({message: 'user already registered'});
    }
  } catch (error) {
    return res.status(500).send({message: 'something went wrong'});
  }

  try {
    const newUser = await createUser(name, email, password);

    const verificationLink = await sendEmail(newUser._id, newUser.email);

    await updateUser({_id: newUser.id}, {verificationLink});

    const token = generateToken(newUser.id);

    const data = {
      accessToken: token,
    };

    res.status(201).send({
      data,
      message: 'registered successfully',
    });
  } catch (err) {
    res.status(400).send({message: err});
  }
};

exports.verifyEmail = async (req, res) => {
  const {error} = validateVerifyEmail(req.query);

  if (error) return res.status(400).send({message: error.details[0].message});

  try {
    const id = verifyJwtToken(req.query.token);

    if (id === req.query.id) {
      await updateUser({_id: id}, {isVerified: true});

      return res.status(200).send({
        message: 'mail verified successfully.',
      });
    } else {
      return res.status(400).send({
        message: 'unrecognized verification link.',
      });
    }
  } catch (err) {
    let message = err.message;
    if (err.name === 'TokenExpiredError') {
      message = 'link expired, please request a new one.';
    }
    return res.status(400).send({message});
  }
};

exports.signin = async (req, res) => {
  const {error} = validateSignIn(req.body);

  if (error) return res.status(400).send({message: error.details[0].message});

  const {email, password} = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).send({
        message: 'invalid email or password',
      });
    }

    // check password matching
    const passwordIsValid = compareUserPassword(password, user.password);

    if (!passwordIsValid) {
      return res.status(400).send({
        message: 'invalid email or password',
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


exports.resendVerificationLink = async (req, res) => {
  const {error} = validateResendVerificationLink(req.query);

  if (error) return res.status(400).send({message: error.details[0].message});

  const {email} = req.body;

  try {
    const user = await getUserByEmail(email);

    if (user) {
      const verificationLink = await sendEmail(user._id, user.email);

      await updateUser({_id: user.id}, {verificationLink});

      return res.status(200).send({
        message: 'verification link is sent to your email',
      });
    } else {
      return res.status(404).send({message: 'user not found'});
    }
  } catch (error) {
    return res.status(500).send({message: 'something went wrong'});
  }
};
