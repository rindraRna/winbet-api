let express =require('express');
let app = express();
let bodyParser = require('body-parser');
let championnat = require('./routes/championnat');
let compte = require('./routes/compte');
let equipe = require('./routes/equipe');
let match = require('./routes/match_paris');
let pari = require('./routes/pari');
let type = require('./routes/type');
let panier = require('./routes/panier');
let pari_panier = require('./routes/pari_panier');
let administrateur = require('./routes/administrateur');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud
const uri = 'mongodb+srv://jonatana:jonatana@cluster0.4n2xp.mongodb.net/Baseparis?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB dans le cloud !");
    console.log("at URI = " + uri);
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,,Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/championnats')
  .get(championnat.getChampionnats)
  .post(championnat.ajout)
  .put(championnat.modifier);
app.route(prefix + '/championnats/:nom')
  .get(championnat.recherche);    
app.route(prefix + '/championnat/:id')
  .get(championnat.getChampionnatById)
  .delete(championnat.supprimer);  
app.route(prefix + '/championnat/nom/:nom')
  .get(championnat.getChampionnatByNom);   

app.route(prefix + '/comptes')
  .get(compte.getComptes);
app.route(prefix + '/comptes/:mot')
  .get(compte.recherche);  
app.route(prefix + '/compte/:id')
  .get(compte.getCompte)
  .delete(compte.supprimer);
app.route(prefix + '/compte/inscription')
  .post(compte.inscrire);
app.route(prefix + '/comptes/nombre/utilisateur')
  .get(compte.getNbUtilisateur);
app.route(prefix + '/compte/login')
  .post(compte.login);
app.route(prefix + '/compte/deposer')
  .put(compte.faireDepot);
app.route(prefix + '/compte/decaisser')
  .put(compte.decaisser);
app.route(prefix + '/moi')
  .get(compte.verificationToken,compte.decoder); 

app.route(prefix + '/administrateur/inscription')
  .post(administrateur.inscrire);
app.route(prefix + '/administrateur/login')
  .post(administrateur.login);
app.route(prefix + '/administrateur/moi')
  .get(administrateur.verificationToken2,administrateur.decoder2);


app.route(prefix + '/equipes')
  .get(equipe.getEquipes)
  .post(equipe.ajout)
  .put(equipe.modifier);
app.route(prefix + '/equipes/:nom')
  .get(equipe.recherche);   
app.route(prefix + '/equipe/:nom')
  .get(equipe.getEquipeByNom);
app.route(prefix + '/equipe/id/:id')
  .get(equipe.getEquipeById)
  .delete(equipe.supprimer);  
  
app.route(prefix + '/matchs/pariables')
  .get(match.getMatchsPariable);
app.route(prefix + '/matchs')
  .get(match.getMatchs)
  .post(match.ajout)
  .put(match.modifier)
  .delete(match.toutSupprimer); ;  
app.route(prefix + '/matchs/dernierId')
  .get(match.dernierMatchInsere);
app.route(prefix + '/matchs/:idChampionnat')
  .get(match.getMatchsByChampionnat);
app.route(prefix + '/matchs/:date/:equipe/:championnat/:etat')
  .get(match.rechercheMulticritere);      
app.route(prefix + '/matchs/:date/:equipe/:championnat')
  .get(match.rechercheMulticritereSansEtat);      
app.route(prefix + '/match/:id')
  .get(match.getMatchById)
  .delete(match.supprimer);  
app.route(prefix + '/matchs/recherche/:texte')
  .get(match.rechercheSimple);  

app.route(prefix + '/pari/:idMatch/:idType')
  .get(pari.getPariByIdMatchAndIdType);
app.route(prefix + '/pari/:id')
  .get(pari.getPariById);  
app.route(prefix + '/pari/match/:idMatch/valeur/:valeur')
  .get(pari.getPariByIdMatchAndValeur);  
app.route(prefix + '/pari/match/id/:idMatch')
  .get(pari.getPariByIdMatch);   
app.route(prefix + '/paris')
  .post(pari.ajout)
  .put(pari.modifier)
  .delete(pari.toutSupprimer);    

app.route(prefix + '/type/:nom')
  .get(type.getTypeByNom);    

app.route(prefix + '/paniers')
  .post(panier.creer)
  .put(panier.modifier)
  .delete(panier.toutSupprimer);
app.route(prefix + '/panier/:id')
  .get(panier.getPanierById);  
app.route(prefix + '/paniers/compte/:idCompte')
  .get(panier.getPanierByIdCompte);  
app.route(prefix + '/paniers/nb/mois/:mois')
  .get(panier.getNbPanierByMois);  

app.route(prefix + '/pari_paniers')   
  .delete(pari_panier.toutSupprimer)
  .post(pari_panier.ajout)
  .put(pari_panier.modifier);
app.route(prefix + '/pari_paniers/panier/:idPanier')   
  .get(pari_panier.getParisByIdPanier);  
app.route(prefix + '/pari_panier/compte/:id')   
  .get(pari_panier.getNbPariByIdUtilisateur);  
app.route(prefix + '/pari_paniers/revenu')   
  .get(pari_panier.revenuApplication);  
app.route(prefix + '/pari_panier/match/:idMatch/valeur/:valeur')   
  .get(pari_panier.getPariByIdMatchAndValeur);   
app.route(prefix + '/pari_panier/qrCode/:idPanier')   
  .get(pari_panier.donneesQrCode); 

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


