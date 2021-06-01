let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let championnat = require('./routes/championnat');
let compte = require('./routes/compte');
let equipe = require('./routes/equipe');
let match = require('./routes/match_paris');
let pari = require('./routes/pari');
let type = require('./routes/type');

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
  .get(championnat.getChampionnats);

app.route(prefix + '/comptes')
  .get(compte.getComptes);
app.route(prefix + '/compte/:id')
  .get(compte.getCompte);
app.route(prefix + '/compte/inscription')
  .post(compte.inscrire);
app.route(prefix + '/compte/login')
  .post(compte.login);
app.route(prefix + '/moi')
  .get(compte.verificationToken,compte.decoder);

app.route(prefix + '/championnat/:id')
  .get(championnat.getChampionnatById);  

app.route(prefix + '/championnat/nom/:nom')
  .get(championnat.getChampionnatByNom);  

app.route(prefix + '/equipes')
  .get(equipe.getEquipes); 

app.route(prefix + '/equipe/:nom')
  .get(equipe.getEquipeByNom); 
  
app.route(prefix + '/matchs')
  .get(match.getMatchs)
  .post(match.ajout);  

app.route(prefix + '/matchs/dernierId')
  .get(match.dernierMatchInsere);

app.route(prefix + '/matchs/:idChampionnat')
  .get(match.getMatchsByChampionnat);
  
app.route(prefix + '/matchs/:date/:equipe/:championnat/:etat')
  .get(match.rechercheMulticritere);      

app.route(prefix + '/matchs/:date/:equipe/:championnat')
  .get(match.rechercheMulticritereSansEtat);      

app.route(prefix + '/match/:id')
  .get(match.getMatchById);  

app.route(prefix + '/pari/:idMatch/:idType')
  .get(pari.getPariByIdMatchAndIdType);  

app.route(prefix + '/pari/:idMatch')
  .get(pari.getPariByIdMatch);    

app.route(prefix + '/paris')
  .post(pari.ajout);    

app.route(prefix + '/type/:nom')
  .get(type.getTypeByNom);    

// app.route(prefix + '/assignments/:id')
//   .get(assignment.getAssignment)
//   .delete(assignment.deleteAssignment);


// app.route(prefix + '/assignments')
//   .post(assignment.postAssignment)
//   .put(assignment.updateAssignment);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


