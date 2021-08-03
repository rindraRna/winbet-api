let Administrateur = require('../model/administrateur');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function verificationToken2(req, res, next){
    // Récupération du token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)

    // Présence d'un token
    if (!token) {
        return res.status(401).json({ message: 'Erreur .Besoin de token ' })
    }
    jwt.verify(token,'RESTFULAPIss', function(err, decoded) {
        if (err){
            console.log(err);
            return res.status(500).send('Token non reconnu.');
        }
         else {
            console.log(decoded)
           console.log(decoded._id+" id ")
            Administrateur.findById(decoded._id, { password: 0 }, function (err, compte) {
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

function inscrire(req, res) {

    const username = req.body.username;
    const password= req.body.password;

  Administrateur.findOne({username:username}, (err, compte) =>{

     //Erreur sur mongoDB
     if(err) {
      console.log(err)
      return res.status(500).send('Erreur sur le serveur.');
    }

    //Doublon trouvé
    if (compte){
      console.log("Email déjà existant");
      return res.status(400).send({etat:false, message:'Nom déjà existant.'});
    }
    if(!username || !password ) {
      return res.status(500).send({etat:false, message: 'insertion impossible '});
    }else {
      var nouveauCompte = new Administrateur();
      nouveauCompte.username=username;
      nouveauCompte.password =bcrypt.hashSync(password,8);
      nouveauCompte.save(function(err, compte) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        compte.password=undefined;
        return res.json({etat:true,  compte});
      }
    });
    }
    


  });
    
  }
  function decoder2(req, res){


    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    // Décodage du token
    const decoded = jwt.decode(token, { complete: false })
    console.log(decoded);

    return res.json({ content: decoded })
}

function extractBearerToken (headerValue) {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

function login (req, res) {

    const username = req.body.username;
    const motDePasse = req.body.password;

   console.log("Connexion avec nomutilisateur : " + username);
    Administrateur.findOne({
        username: username
    }, function(err, compte) {
        //Erreur sur le serveur 
        console.log(compte)
      if (err){
        console.log(err);
        return res.status(500).send('Erreur sur le serveur.');
      }
      if (!compte || !compte.comparePassword(motDePasse)) {
        return res.status(401).json({ auth: false , token: '',message: 'Identifiant et/ou mot de passe érroné' });
      }
      //Créer le token de connexion et la retourne
      let token=jwt.sign({ username: compte.username, _id: compte._id }, 'RESTFULAPIss');
      return res.json({ auth: true, token: token, message: 'Connexion réussie.' });
    });
  }

  module.exports = {inscrire,login ,decoder2,verificationToken2};