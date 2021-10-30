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

    const check = await Check.findOne({ name: req.params.name });

    if (!check) return res.status(404).send({ message: "Check Not Found" });

    return res.status(200).send(check);
}

exports.getChecksByTag = async (req, res) => {

    const checks = await Check.find({ "tags": req.params.tag });

    if (!checks) return res.status(404).send({ message: "Invalid Tag" });

    return res.status(200).send(checks);
}


exports.updateCheck = async (req, res) => {

    try {
        const check = await Check.findOne({ _id: req.params.id });

        if (!check) return res.status(404).send({ message: "Check Not Found" });

        if (req.user.id != check.userId) return res.status(403).send({ message: "Unauthorized" });

        
        if (req.body.name) {
            const dupCheck = await Check.find({ name: req.body.name });

            if (dupCheck.length) {
                return res.status(400).send({ message: "Duplicate Name" });
            }

        }

        const updateKeys = Object.keys(req.body);

        updateKeys.forEach((key) => {
            if (key !== "userId") {
                check[key] = req.body[key];
            }
        });

        check.save();

        return res.status(200).send(check);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong" });
    }
}

exports.deleteCheck = async (req, res) => {

    try {
        let check = await Check.findOne({ _id: req.params.id });

        if (req.user.id != check.userId) return res.status(403).send({ message: "Unauthorized" });
        
        check = await Check.findOneAndRemove({ _id: req.params.id });

        if (!check) return res.status(404).send({ message: "Check Not Found" });

        return res.status(200).send(check);
    } catch (err) {
        return res.status(500).send({ message: "Something went wrong" });
    }
}
