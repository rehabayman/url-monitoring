const {Check} = require('../models/check');

exports.createCheck = async (checkAttributes) => {
  const newCheck = new Check(checkAttributes);
  await newCheck.save();
  return newCheck;
};

exports.getCheckByName = async (name) => {
  const check = await Check.findOne({name});
  return check;
};

exports.getChecksByTag = async (tag) => {
  const checks = await Check.find({'tags': tag});
  return checks;
};

exports.getCheckById = async (id) => {
  const check = await Check.findOne({_id: id});
  return check;
};

exports.updateCheck = async (selectorAttributes, updatableAttributes) => {
  return await Check.updateOne(selectorAttributes, updatableAttributes);
};

exports.deleteCheck = async (id) => {
  const check = await Check.findOneAndRemove({_id: id});
  return check;
};
