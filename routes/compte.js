//const compte = require('../model/compte');
let Compte = require('../model/compte');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Récupérer tous les assignments (GET)
function getComptes(req, res){
    Compte.find((err, comptes) => {
        if(err){
            res.send(err)
        }

        res.send(comptes);
    });
}

// Récupérer un assignment par son id (GET)
 function getCompte(req, res){
     let compteId = req.params.id;
     console.log(compteId+" id compte");
     Compte.findOne({_id: compteId}, (err, compte) =>{
         if(err){res.send(err)}
         res.json(compte);
    })
 }

 function inscrire(req, res) {

    const email = req.body.email;
    const nomUtilisateur = req.body.nomUtilisateur;
    const motDePasse = req.body.motDePasse;
    const solde = req.body.solde;

  //Vérification email
  let emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)){
      console.log("Email invalide");
      return res.status(400).send('Email invalide.');
  }

  Compte.findOne({nomUtilisateur: nomUtilisateur}, (err, compte) =>{

     //Erreur sur mongoDB
     if(err) {
      console.log(err)
      return res.status(500).send('Erreur sur le serveur.');
    }

    //Doublon trouvé
    if (compte){
      console.log("Nom déjà existant");
      return res.status(400).send({etat:false, message:'Nom déjà existant.'});
    }
    if(!nomUtilisateur || !email || !motDePasse || !solde ) {
      return res.status(500).send({etat:false, message: 'insertion impossible '});
    }else {
      var nouveauCompte = new Compte();
      nouveauCompte.nomUtilisateur=nomUtilisateur;
      
      nouveauCompte.email=email;
      nouveauCompte.solde=solde;
    
      nouveauCompte.hash_motDePasse =bcrypt.hashSync(motDePasse,8);
      nouveauCompte.save(function(err, compte) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        compte.hash_motDePasse=undefined;
        return res.json({etat:true,  compte});
      }
    });
    }
  });
    
  }

  function login (req, res) {

    const nomUtilisateur = req.body.nomUtilisateur;
    const motDePasse = req.body.motDePasse;

   console.log("Connexion avec nomutilisateur : " + nomUtilisateur);
    Compte.findOne({
      nomUtilisateur: nomUtilisateur
    }, function(err, compte) {
        //Erreur sur le serveur 
      if (err){
        console.log(err);
        return res.status(500).send('Erreur sur le serveur.');
      }
      if (!compte || !compte.comparePassword(motDePasse)) {
        return res.status(401).json({ auth: false , token: '',message: 'Identifiant et/ou mot de passe érroné' });
      }
      //Créer le token de connexion et la retourne
      let token=jwt.sign({ email: compte.email, nomUtilisateur: compte.nomUtilisateur,solde:compte.solde, _id: compte._id }, 'RESTFULAPIs');
      return res.json({ auth: true, token: token, idCompte: compte._id, message: 'Connexion réussie.' });
    });
  }
  function extractBearerToken (headerValue) {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}
function verificationToken(req, res, next){
    // Récupération du token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)

    // Présence d'un token
    if (!token) {
        return res.status(401).json({ message: 'Erreur .Besoin de token ' })
    }
    jwt.verify(token,'RESTFULAPIs', function(err, decoded) {
        if (err){
            console.log(err);
            return res.status(500).send('Token non reconnu.');
        }
         else {
            console.log(decoded)
           console.log(decoded._id+" id ")
            Compte.findById(decoded._id, { password: 0 }, function (err, compte) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Erreur sur le serveur.');
                }
                if (!compte) return res.status(404).send('Utilisateur non reconnu');
    
                req.compte = compte;
    
                return next();
            });
        }
    });
}
  function decoder(req, res){


    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    // Décodage du token
    const decoded = jwt.decode(token, { complete: false })
    console.log(decoded);

    return res.json({ content: decoded })
}


module.exports = { getComptes,getCompte,inscrire,login ,decoder,verificationToken};