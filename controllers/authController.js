const { validateUser } = require('../validations/userValidator');
const { User } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    const { error } = validateUser(req.body);

    if (error) res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });

    if (user) {
        res.status(400).send({ message: "user already registered" });
    }

    let newUser = new User({ name: req.body.name, email: req.body.email, password: req.body.password });

    try {
        newUser = await newUser.save();

        const emailToken = jwt.sign({id: newUser._id}, process.env.EMAIL_SECRET, {
            expiresIn: 86400 //1 day in seconds [24 hours]
        });

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // user
                pass: process.env.EMAIL_PASS, // password
            }
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: `URL Monitoring App <${process.env.EMAIL_USER_DISPLAY}>`, // sender address
            to: newUser.email, // list of receivers
            subject: "Mail Activation", // Subject line
            text: `Pleased to have you in our application.\nPlease Activate your mail from this link: ${process.env.ACTIVATION_LINK}${emailToken}`, // plain text body
        });

        let token = generateToken(newUser.id);

        let data = {
            accessToken: token,
        };

        res.status(201).send({
            data,
            message: "Registered Successfully",
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }

}

exports.verifyEmail = async (req, res) => {
    try {
        const {id} = jwt.verify(req.query.token, process.env.EMAIL_SECRET, {
            expiresIn: 86400 //1 day in seconds [24 hours]
        });
        await User.updateOne({_id: id}, {isVerified: true});
        res.status(200).send({message: "Mail Verified Successfully. You can Login Now."})
    } catch (err) {
        res.status(400).send({message: err});
    }
}

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({
                message: "Invalid Email or Password",
            });
        }

        if (!user.isVerified) {
            return res.status(400).send({
                message: "Email is not verified",
            });
        }

        //check password matching
        let passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(400).send({
                message: "Invalid Email or Password"
            });
        }

        // assign the three parts ot the token
        let token = generateToken(user.id);

        res.status(200).send({
            accessToken: token,
        });

    } catch (err) {
        res.status(500).send({
            message: "Server Error",
        });
    }
}

const generateToken = (userId) => {
    // assign the three parts ot the token
    let token = jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: 172800, //8 hours
    });

    return token;
}