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
    newUser = await createUser(name, email, password);

    await sendEmail(newUser._id, newUser.email);

    const token = generateToken(newUser.id);

    const data = {
      accessToken: token,
    };

    res.status(201).send({
      data,
      message: 'Registered Successfully',
    });
  } catch (err) {
    res.status(400).send({message: err});
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const id = verifyJwtToken(req.query.token);

    await updateUser({_id: id}, {isVerified: true});

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
    const user = await getUserByEmail(email);

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
    const passwordIsValid = compareUserPassword(password, user.password);

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
