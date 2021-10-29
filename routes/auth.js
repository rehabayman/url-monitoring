const express = require("express");
const router = express.Router();
const { signup, signin, verifyEmail } = require("../controllers/auth");

router.post(
    "/signup",
    signup
);

router.post(
    "/signin",
    signin
);

router.get(
    "/verify/email",
    verifyEmail
);

exports.authRouter = router;