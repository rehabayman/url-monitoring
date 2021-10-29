const app = require("express")();
require('dotenv').config();
const PORT = process.env.PORT;


app.listen(PORT, (err) => {
    if (!err) console.log(`App Started on port: ${PORT}`);
});

// Error Middleware
app.use((err, req, res, next) => {
    console.log(err);
    if (err) res.status(500).send("Internal Server Error.");
});
