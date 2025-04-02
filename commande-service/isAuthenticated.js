const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "Aucun token fourni" });
    }

    jwt.verify(token.split(" ")[1], "secret", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token invalide ou expiré" });
        }
        req.user = decoded;  // Attach the decoded token payload to the request object
        next();  // Allow the request to proceed to the next middleware or route
    });
};

module.exports = isAuthenticated;
