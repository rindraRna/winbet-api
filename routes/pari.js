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

function ajout(req, res){
    let pari = new Pari();
    pari.match = req.body.match;
    pari.type = req.body.type;
    pari.valeur = req.body.valeur;
    pari.cote = req.body.cote;
    pari.mise = req.body.mise;

    pari.save( (err) => {
        if(err){
            res.send('cant post pari ', err);
        }
        res.json({ message: "pari enregistré"})
    })
}

module.exports = { ajout, getPariByIdMatchAndIdType, getPariByIdMatch };