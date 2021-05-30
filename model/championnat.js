let mongoose =require('mongoose');
let Schema = mongoose.Schema;

let ChampionnatSchema = Schema({
    nom: String
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Championnat', ChampionnatSchema);
