let Equipe = require('../model/equipe');

function getEquipes(req, res){
    Equipe.find((err, equipes) => {
        if(err){
            res.send(err)
        }
        res.send(equipes);
    }).sort({nom: 1});
}

module.exports = { getEquipes };