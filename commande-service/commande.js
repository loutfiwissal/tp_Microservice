const mongoose = require('mongoose');
const CommandeSchema = mongoose.Schema({
    produit: { type:[String] }
    ,email_utulisateur: String,
    prix_total: Number,
    crated_at: { type: Date, 
        default: Date.now() },
});
module.exports = Commande = mongoose.model("commande", CommandeSchema);