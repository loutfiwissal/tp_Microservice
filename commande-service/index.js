const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Commande = require("./commande");
const PORT = process.env.PORT_TWO || 4001;
const axios = require("axios");
const isAuthenticated = require("./isAuthenticated"); // Middleware d'authentification

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/commande-service", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connecté à MongoDB"))
.catch((err) => console.error("Erreur de connexion MongoDB :", err));

app.use(express.json());

// Fonction pour calculer le prix total
function prixTotal(produits) {
    let total = produits.reduce((sum, produit) => sum + (produit.prix || 0), 0);
    console.log("Total:", total);
    return total;
}

// Fonction pour récupérer les prix des produits via API
async function httpRequest(ids) {
    try {
        const URL = "http://localhost:4000/produit/acheter";
        const response = await axios.post(URL, { ids:ids }, {
            headers: { "Content-Type": "application/json" }
        });
        return prixTotal(response.data);
    } catch (error) {
        console.error("Erreur API produit:", error.message);
        return 0; 
    }
}

// Route pour ajouter une commande
app.post("/commande/ajouter", isAuthenticated ,async (req, res) => {
    try {
        
        const { ids} = req.body;
        const total = await httpRequest(ids); 

        const newCommande = new Commande({
            produit: ids,
            email_utulisateur : req.user.email,
            prix_total: total
        });

        const commande = await newCommande.save();
        res.status(201).json(commande);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Commande service en cours d'exécution sur le port ${PORT}`);
});
