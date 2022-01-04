const {validateCheck} = require('../validations/checkValidator');
const {monitorCheck} = require('../services/monitorService');
const {
  createCheck,
  getCheckByName,
  getChecksByTag,
  getCheckById,
  deleteCheck,
} = require('../services/checkService');
const {getUserById} = require('../services/userService');


exports.createCheck = async (req, res) => {
  req.body.userId = req.user.id;

  const {error} = validateCheck(req.body);

  if (error) return res.status(400).send({message: error.details[0].message});

  try {
    const check = await createCheck(req.body);

    res.status(200).send({
      check,
    });
  } catch (err) {
    res.status(400).send({
      message: 'There\'s a check with this name already registered',
    });
  }
};

exports.getCheck = async (req, res) => {
  try {
    const check = await getCheckByName(req.params.name);

    if (!check) return res.status(404).send({message: 'Check Not Found'});

    const user = await getUserById(req.user.id);

    monitorCheck(check, user);

    return res.status(200).send({message: `Started monitoring check`});
  } catch (err) {
    return res.status(500).send({message: 'something went wrong'});
  }
};

exports.getChecksByTag = async (req, res) => {
  try {
    const checks = await getChecksByTag(req.params.tag);

    if (!checks) return res.status(404).send({message: 'Invalid Tag'});

    monitorCheck(check, user);

    return res.status(200).send({message: `Started monitoring checks`});
  } catch (error) {
    return res.status(500).send({message: 'something went wrong'});
  }
};


exports.updateCheck = async (req, res) => {
  try {
    const check = await getCheckById(req.params.id);

    if (!check) return res.status(404).send({message: 'Check Not Found'});

    if (req.user.id != check.userId) {
      return res.status(403).send({message: 'Unauthorized'});
    }

    if (req.body.name) {
      const dupCheck = await getCheckByName(req.body.name);

      if (dupCheck.length) {
        return res.status(400).send({message: 'Duplicate Name'});
      }
    }

    const updateKeys = Object.keys(req.body);

    updateKeys.forEach((key) => {
      if (key !== 'userId') {
        check[key] = req.body[key];
      }
    });

    check.save();

    return res.status(200).send(check);
  } catch (err) {
    return res.status(500).send({message: 'Something went wrong'});
  }
};

exports.deleteCheck = async (req, res) => {
  try {
    let check = await getCheckById(req.params.id);

    if (req.user.id != check.userId) {
      return res.status(403).send({message: 'Unauthorized'});
    }

    check = await deleteCheck(req.params.id);

    if (!check) return res.status(404).send({message: 'Check Not Found'});

    return res.status(200).send(check);
  } catch (err) {
    return res.status(500).send({message: 'Something went wrong'});
  }
};
