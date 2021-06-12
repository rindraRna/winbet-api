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

module.exports = { getParisByIdPanier, toutSupprimer, ajout };
