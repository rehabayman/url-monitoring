const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const EMAIL_SECRET = process.env.EMAIL_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_USER_DISPLAY = process.env.EMAIL_USER_DISPLAY;
const ACTIVATION_LINK = process.env.ACTIVATION_LINK;

exports.sendEmail = async (userId, userEmail) => {
  const emailToken = jwt.sign({id: userId}, EMAIL_SECRET, {
    expiresIn: 86400, // 1 day in seconds [24 hours]
  });

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: EMAIL_USER, // user
      pass: EMAIL_PASSWORD, // password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `URL Monitoring App <${EMAIL_USER_DISPLAY}>`,
    to: userEmail,
    subject: 'Mail Activation',
    text: `Pleased to have you in our application.\n
            Please Activate your mail from this 
            link: ${ACTIVATION_LINK}${emailToken}`,
  });
};
