const express = require('express');
const router = express.Router();
const {
  signup, signin,
  verifyEmail, resendVerificationLink,
} = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth APIs
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     description: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         appliation/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               name:
 *                 type: string
 *                 example: User Test
 *               password:
 *                 type: string
 *                 example: usertest_123
 *     responses:
 *       201:
 *         description: User signs up successfully and a verification email
 *                      is sent to him.
 *         content:
 *           appliation/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: Tjhbsdjfbkljopeu
 *                 message:
 *                   type: string,
 *                   example: registered successfully
 *       400:
 *         description: User didn't provide all required data.
 *         content:
 *           appliation/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string,
 *                   example: email is required
 */
router.post(
    '/signup',
    signup,
);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     description: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         appliation/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: usertest_123
 *     responses:
 *       200:
 *         description: User signs in successfully.
 *         content:
 *           appliation/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: Tjhbsdjfbkljopeu
 *       400:
 *         description: User didn't provide all required data
 *                      or provided invalid data.
 *         content:
 *           appliation/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               missing data:
 *                value:
 *                  message: email is required
 *               invalid data:
 *                value:
 *                  message: invalid email or password
 */
router.post(
    '/signin',
    signin,
);

/**
 * @swagger
 * /auth/verify/email:
 *   get:
 *     description: User's email verification
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *          type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: User's email is verified successfully.
 *         content:
 *           appliation/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: mail verified successfully.
 *       400:
 *         description: Link is unrecognized or expired.
 *         content:
 *           appliation/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               unrecognized link:
 *                value:
 *                  message: unrecognized verification link.
 *               expired link:
 *                value:
 *                  message: link expired, please request a new one.
 */
router.get(
    '/verify/email',
    verifyEmail,
);

/**
 * @swagger
 * /auth/verify/email/resend:
 *   get:
 *     description: Resend email verification link to user.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Verification link is sent successfully.
 *         content:
 *           appliation/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: verification link is sent to your email
 *       404:
 *         description: User provided invalid email.
 *         content:
 *           appliation/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user not found
 */
router.get(
    '/verify/email/resend',
    resendVerificationLink,
);

exports.authRouter = router;
