let Panier = require('../model/panier');

function creer(req, res){
    let panier = new Panier();
    panier.compte = req.body.compte;
    panier.date = req.body.date;
    panier.gainTotal = req.body.gainTotal;
    panier.miseTotal = req.body.miseTotal;
    panier.qrCode = req.body.qrCode;
    panier.save( (err) => {
        if(err){
            res.send('cant post Panier ', err);
        }
        res.json({ message: panier._id })
    })
}

function getPanierById(req, res){
    Panier.findOne({_id: req.params.id}, (err, panier) => {
        if(err){
            res.send(err)
        }
        res.send(panier);
    });
}

function modifier(req, res) {
    Panier.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, panier) => {
        if (err) {
            res.send(err)
        } else {
          res.json({message: `${panier._id} updated`})
        }
    });

}

function toutSupprimer(req, res){
    Panier.remove( (err, panier) => {
        if (err) {
            res.send(err)
        } else {
          res.json({message: `paniers tout supprimés`})
        }
    })
}

function getPanierByIdCompte(req, res){
    let idCompte = req.params.idCompte;
    Panier.find({"compte._id": idCompte}, (err, paniers) => {
        if(err){
            res.send(err)
        }
        res.send(paniers);
    }).sort({date: -1});
}

function getNbPanierByMois(req, res){
    let mois = Number(req.params.mois);

    Panier.aggregate(
        [
            {$project: { "month" : {$month: '$date'}}},
            {$match: { month: mois}},
            { $group: { _id: "_id", resultat: { $sum: 1 } } }
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

module.exports = { getNbPanierByMois, getPanierByIdCompte, toutSupprimer, modifier, creer, getPanierById };
