let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Match_PariSchema = Schema({
    equipe1: Object, 
    equipe2: Object, 
    etat: Number,
    date: Date,
    stade: String, 
    endroit: String, 
    championnat: Object, 
    statut:String 
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Match_Pari', Match_PariSchema);
