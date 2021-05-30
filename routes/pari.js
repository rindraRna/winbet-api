let Pari = require('../model/pari');

function getPariByIdMatchAndIdType(req, res){
    idMatch = req.params.idMatch;
    idType = req.params.idType;
    Pari.find({"match._id": idMatch, "type._id": idType}, (err, paris) => {
        if(err){
            res.send(err)
        }
        res.send(paris);
    });
}

function getPariByIdMatch(req, res){
    idMatch = req.params.idMatch;
    Pari.find({"match._id": idMatch}, (err, paris) => {
        if(err){
            res.send(err)
        }
        res.send(paris);
    });
}

module.exports = { getPariByIdMatchAndIdType, getPariByIdMatch };