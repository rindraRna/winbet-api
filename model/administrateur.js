let mongoose =require('mongoose');
const bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let AdministrateurSchema = Schema({
    username: String,
    password:String,
});

AdministrateurSchema.methods.comparePassword = function(mdp) {
    return bcrypt.compareSync(mdp,this.password);
  };

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Administrateur', AdministrateurSchema);
