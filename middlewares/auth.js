const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send();
            }
            
            req.user = decoded;
            next();
        });
    } else {
        return res.status(403).send({ message: "No Token Provided" })
    }
}

