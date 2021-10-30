const express = require("express");
const router = express.Router();
const { 
    createCheck, 
    getCheck, 
    getChecksByTag, 
    deleteCheck, 
    updateCheck
} = require("../controllers/checkController");
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

router.get(
    "/bulk/:tag",
    verifyToken,
    getChecksByTag
);

router.put(
    "/:id",
    verifyToken,
    updateCheck
);

router.delete(
    "/:id",
    verifyToken,
    deleteCheck
);

exports.checkRouter = router;