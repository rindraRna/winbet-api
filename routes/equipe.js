let Equipe = require('../model/equipe');

function getEquipes(req, res){
    Equipe.find((err, equipes) => {
        if(err){
            res.send(err)
        }
        res.send(equipes);
    }).sort({nom: 1});
}

function getEquipeByNom(req, res){
    Equipe.findOne({nom: req.params.nom}, (err, equipe) => {
        if(err){
            res.send(err)
        }
        res.send(equipe);
    });
}

module.exports = { getEquipeByNom, getEquipes };