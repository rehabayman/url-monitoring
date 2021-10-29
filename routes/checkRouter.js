const express = require("express");
const router = express.Router();
const { createCheck, getCheck } = require("../controllers/checkController");
const { verifyToken } = require('../middlewares/auth');

router.post(
    "/",
    verifyToken,
    createCheck
);

router.get(
    "/:name",
    verifyToken,
    getCheck
);

exports.checkRouter = router;