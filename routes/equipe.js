let Equipe = require('../model/equipe');

function getEquipes(req, res){
    Equipe.find((err, equipes) => {
        if(err){
            res.send(err)
        }
        res.send(equipes);
    });
}

module.exports = { getEquipes };