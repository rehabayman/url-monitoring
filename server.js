const express = require('express');
const app = express();
require('dotenv-expand')(require('dotenv').config());
const PORT = process.env.PORT;
const db = require('./database/db');
const APP_ENV = process.env.APP_ENV;
const {authRouter} = require('./routes/authRouter');
const {checkRouter} = require('./routes/checkRouter');

const isTest = APP_ENV === 'dev' ? false : true;
db.connect(isTest);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/check', checkRouter);

const server = app.listen(PORT, (err) => {
  if (!err) console.log(`App Started on port: ${PORT}`);
});

// Error Middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (err) res.status(500).send('Internal Server Error.');
});

module.exports = server;
