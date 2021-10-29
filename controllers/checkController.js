const { validateCheck } = require('../validations/checkValidator');
const { Check } = require('../models/checkModel');


exports.createCheck = async (req, res) => {
    req.body.userId = req.user.id

    const { error } = validateCheck(req.body);

    if (error) res.status(400).send({ message: error.details[0].message });

    let check = new Check(req.body);

    try {
        check = await check.save();

        res.status(200).send({
            message: "Check Created Successfully",
            check
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({
            message: "There's a check with this name already registered"
        });
    }
}

exports.getCheck = async (req, res) => {

    const check = await Check.findOne({name: req.params.name});

    if(!check) return res.status(404).send({message: "Check Not Found"});

    return res.status(200).send(check);
}
