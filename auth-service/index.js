const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4002;
const mongoose = require("mongoose");
const Utilisateur = require("./utilisateur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

mongoose.set("strictQuery", true);

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/auth-service", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connecté à MongoDB");
    } catch (error) {
        console.error("Erreur de connexion à MongoDB :", error);
        process.exit(1); // Quitter le process en cas d'erreur
    }
};

connectDB();

app.use(express.json());

app.post("/auth/register", async (req, res) => {
    let { nom, email, mot_de_passe } = req.body;
    const userExists = await Utilisateur.findOne({ email });
    if (userExists) {
        return res.status(400).send("Utilisateur déjà existant");
    } else {
        bcrypt.hash(mot_de_passe, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err });
            } else {
                mot_de_passe = hash;
                const newUser = new Utilisateur({
                    nom,
                    email,
                    mot_de_passe,
                });
                newUser.save()
                    .then(user => res.status(201).json(user))
                    .catch(err => res.status(400).json({ error: err.message }));
            }
        });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, mot_de_passe } = req.body;
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
    } else {

        bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe, (err, result) => {
            if (!result) {
                return res.json({ message: "Mot de passe incorrect" });
            } else {
                const payload = {
                    email,
                    nom: utilisateur.nom,
                };
                jwt.sign(payload, "secret", (err, token) => {
                    if (err) {
                        return console.error(err);
                    } else {
                        return res.json({ token });
                    }
                });
            }
        });
    }
});


app.listen(PORT, () => {
    console.log(`Auth service en cours d'exécution sur le port ${PORT}`);
});
