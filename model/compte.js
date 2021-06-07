//const { Double } = require('bson');
let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let Schema = mongoose.Schema;


let CompteSchema = Schema({
    nomUtilisateur: String,
    email:String,
    hash_motDePasse: String,
    solde: Number
});
 
CompteSchema.methods.comparePassword = function(motDePasse) {
  return bcrypt.compareSync(motDePasse,this.hash_motDePasse);
};
// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Compte', CompteSchema);