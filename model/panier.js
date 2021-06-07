let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PanierSchema = Schema({
    compte: Object, 
    date: Date,
    gainTotal: Number, 
    miseTotal: Number, 
    qrCode:String 
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Panier', PanierSchema);
