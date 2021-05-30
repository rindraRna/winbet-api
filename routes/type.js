let Type = require('../model/type');

function getTypeByNom(req, res){
    nom = req.params.nom;
    Type.findOne({nom: nom}, (err, types) => {
        if(err){
            res.send(err)
        }
        res.send(types);
    });
}

module.exports = { getTypeByNom };