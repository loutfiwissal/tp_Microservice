const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Produit = require("./produit");
const PORT = process.env.PORT_ONE || 4000;

app.use(express.json());
mongoose.set("strictQuery", true);

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/produits", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connecté à MongoDB"))
.catch((err) => console.error("Erreur de connexion MongoDB :", err));

app.post("/produit/ajouter", (req, res, next) => {
    const { nom, description, prix } = req.body;

    const newProduit = new Produit({
        nom,
        description,
        prix,
    });

    newProduit.save()
    .then((produit) => res.status(201).json(produit))
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.post("/produit/acheter", (req, res, next) => {
    const { ids } = req.body;
    Produit.find({ _id: { $in: ids } })
        .then((produits) => res.status(200).json(produits))
        .catch((err) => res.status(400).json({ error: err.message }));
});


app.listen(PORT, () => {
    console.log(`Produit service en cours d'exécution sur le port ${PORT}`);
});
