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

function modifier(req, res) {
    Pari.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, pari) => {
        if (err) {
            res.send(err)
        } else {
          res.json({message: `${pari._id} updated`})
        }
    });
}

function getPariByIdMatchAndValeur(req, res){
    idMatch = req.params.idMatch;
    valeur = req.params.valeur;
    Pari.findOne({"match._id": idMatch, "valeur": valeur}, (err, pari) => {
        if(err){
            res.send(err)
        }
        res.send(pari);
    });
}

module.exports = { getPariByIdMatchAndValeur, modifier, ajout, getPariByIdMatchAndIdType, getPariByIdMatch };