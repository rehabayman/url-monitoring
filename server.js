const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const db = require('./database/db');
const {authRouter} = require('./routes/authRouter');
const {checkRouter} = require('./routes/checkRouter');


db.connect();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/check', checkRouter);

app.listen(PORT, (err) => {
  if (!err) console.log(`App Started on port: ${PORT}`);
});

// Error Middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (err) res.status(500).send('Internal Server Error.');
});
