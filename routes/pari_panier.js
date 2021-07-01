let Pari_Panier = require('../model/pari_panier');

function ajout(req, res){
    let pari_panier = new Pari_Panier();
    pari_panier.pari = req.body.pari;
    pari_panier.panier = req.body.panier;
    pari_panier.save( (err) => {
        if(err){
            res.send('cant post pari_panier ', err);
        }
        res.json({ message: pari_panier._id })
    })
}

function toutSupprimer(req, res){
    Pari_Panier.remove( (err, pari_Panier) => {
        if (err) {
            res.send(err)
        } else {
          res.json({message: `Pari_Panier tout supprimés`})
        }
    })
}

function getParisByIdPanier(req, res){
    let idPanier = req.params.idPanier;
    Pari_Panier.find({"panier._id": idPanier}, (err, paris) => {
        if(err){
            res.send(err)
        }
        res.send(paris);
    });
}

function getPariByIdMatchAndValeur(req, res){
    idMatch = req.params.idMatch;
    valeur = req.params.valeur;
    Pari_Panier.find({"pari.match._id": idMatch, "pari.valeur": valeur}, (err, pari_Panier) => {
        if(err){
            res.send(err)
        }
        res.send(pari_Panier);
    });
}

function modifier(req, res) {
    Pari_Panier.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, pari_Panier) => {
        if (err) {
            res.send(err)
        } else {
          res.json({message: `le pari_Panier ${pari_Panier._id} a été modifié`})
        }
    });
}

function revenuApplication(req, res){
    Pari_Panier.aggregate(
        [
            { $match: { "pari.resultat": 2 } },
            { $group: { _id: "_id", resultat: { $sum: '$pari.mise' } } }
        ], (err, data) => {
            if(err){
                res.send(err)
            }
            if(data.length == 0){
                res.json({"_id":"_id","resultat":0});
            }
            else{
                res.json(data[0]);
            }
        }
    );
}

module.exports = { revenuApplication, modifier, getPariByIdMatchAndValeur, getParisByIdPanier, toutSupprimer, ajout };
