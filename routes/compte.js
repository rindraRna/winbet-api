//const compte = require('../model/compte');
let Compte = require('../model/compte');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

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

 function  faireDepot(req,res){
  let idcompte=req.body.id
  let montant=req.body.montant; 
  console.log(montant+" montant");
  Compte.findOne({_id: idcompte}, (err, compte) =>{
    if(err){res.send(err)}
    if(compte){
      if(Number(montant)>0){
        console.log(compte.solde+" solde avant ");
        compte.solde=compte.solde+ Number(montant);
  
        console.log(compte.solde+" solde apres ");
        Compte.findByIdAndUpdate(req.body.id,{"solde":compte.solde}, {new: true}, (err, compte) => {
          if (err) {
              console.log(err);
              res.send(err)
          } else {
            console.log(compte)
            res.json({message: 'solde du compte a été mis  à jour '})
          }
      });
      }else{
        res.status(400).send('valeur negative ne peut etre deposer .');
      }
    }
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

Compte.findOne({email: email}, (err, compte) =>{

   //Erreur sur mongoDB
   if(err) {
    console.log(err)
    return res.status(500).send('Erreur sur le serveur.');
  }

  //Doublon trouvé
  if (compte){
    console.log("Email déjà existant");
    return res.status(400).send({etat:false, message:'Email déjà existant.'});
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
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tptituwinbet@gmail.com',
          pass: 'tptituwinbet2021'
        }
      });
      
      var mailOptions = {
        from: 'tptituwinbet@gmail.com',
        to: compte.email,
        subject: 'Bienvenue sur winbet',
        text: 'Vous êtes bien inscrit(e) avec le nom '+compte.nomUtilisateur
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
      return res.json({etat:true,  compte});
    }
  });
  }
});
}

  function login (req, res) {

    const email = req.body.email;
    const motDePasse = req.body.motDePasse;

   console.log("Connexion avec nomutilisateur : " + email);
    Compte.findOne({
      email: email
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

function decaisser(req,res){
  let idCompte=req.body.id
  let montant=req.body.montant;
  Compte.findOne({_id: idCompte}, (err, compte) => {
    if(err){ res.send(err) }
    if(compte){
      console.log("compte.solde ancien: "+compte.solde);
      console.log("montant: "+Number(montant));
      compte.solde = compte.solde - Number(montant);
      console.log("compte.solde nouveau: "+compte.solde);
      Compte.findByIdAndUpdate(req.body.id, {"solde":compte.solde}, {new: true}, (err, compte) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          console.log(compte)
          res.json({message: 'solde décaissé'})
        }
      })
    }
  });
}

module.exports = { decaisser, getComptes, getCompte, inscrire, login , decoder, verificationToken, faireDepot};