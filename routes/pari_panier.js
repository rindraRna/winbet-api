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

module.exports = { ajout };
