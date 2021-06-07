let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Pari_PanierSchema = Schema({
    pari: Object, 
    panier: Object 
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Pari_Panier', Pari_PanierSchema);
