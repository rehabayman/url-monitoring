const {User} = require('../models/user');

exports.createUser = async (name, email, password) => {
  const newUser = new User({
    name, email, password,
  });
  await newUser.save();
  return newUser;
};

exports.getUserByEmail = async (email) => {
  const user = await User.findOne({email});
  return user;
};

exports.updateUser = async (selectorAttributes, updatableAttributes) => {
  return await User.updateOne(selectorAttributes, updatableAttributes);
};
