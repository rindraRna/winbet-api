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

module.exports = { modifier, creer, getPanierById };
