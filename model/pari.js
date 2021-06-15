let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PariSchema = Schema({
    match: Object, 
    type: Object, 
    valeur: String,
    cote: Number,
    mise: Number,
    resultat: Number
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Pari', PariSchema);
