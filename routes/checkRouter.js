const express = require('express');
const router = express.Router();
const {
  createCheck,
  getCheck,
  getChecksByTag,
  deleteCheck,
  updateCheck,
} = require('../controllers/checkController');
const {verifyToken, userVerified} = require('../middlewares/auth');

router.post(
    '/',
    [verifyToken, userVerified],
    createCheck,
);

router.get(
    '/:name',
    [verifyToken, userVerified],
    getCheck,
);

router.get(
    '/bulk/:tag',
    [verifyToken, userVerified],
    getChecksByTag,
);

router.put(
    '/:id',
    [verifyToken, userVerified],
    updateCheck,
);

router.delete(
    '/:id',
    [verifyToken, userVerified],
    deleteCheck,
);

exports.checkRouter = router;
