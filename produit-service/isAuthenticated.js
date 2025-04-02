const jwt = require("jsonwebtoken");

module.exports = async function isAuthenticated(req, res, next) {
    const token = req.headers["authorization"]?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Token invalide ou expiré" });
        }
        
        req.user = user; // Attacher les informations de l'utilisateur à la requête
        next(); // Passer à la prochaine fonction middleware ou à la route
    });
};
