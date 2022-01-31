const express = require('express');
const router = express.Router();
const {
  signup, signin,
  verifyEmail, resendVerificationLink,
} = require('../controllers/authController');

router.post(
    '/signup',
    signup,
);

router.post(
    '/signin',
    signin,
);

router.get(
    '/verify/email',
    verifyEmail,
);

router.get(
    '/verify/email/resend',
    resendVerificationLink,
);

exports.authRouter = router;
