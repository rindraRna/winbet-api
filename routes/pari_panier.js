let Pari_Panier = require('../model/pari_panier');
let Panier = require('../model/panier');

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

function getNbPariByIdUtilisateur(req, res){
    let idUtilisateur = req.params.id
    Pari_Panier.aggregate(
        [
            { $match: { "panier.compte._id": idUtilisateur } },
            { $group: { _id: "$panier.compte._id", resultat: { $sum: 1 } } }
        ], (err, data) => {
            if(err){
                res.send(err)
            }
            res.json(data[0]);
        }
    );
}

function donneesQrCode(req, res){
    let idPanier = req.params.idPanier
    var reponse = ""
    var sommeGagne = 0;
    var sommePerdu = 0;
    Panier.findOne({_id: idPanier}, (err, panier) => {
        if(err){
            res.send(err)
        }
        reponse += "Date: "+panier.date+"\n" 
        reponse += "Mise versée: "+panier.miseTotal+"\n" 
        reponse += "Gain potentiel : "+panier.gainTotal+"\n" 
        reponse += "-----------------\n"
        Pari_Panier.find({"panier._id": idPanier}, (err, paris) => {
            if(err){
                res.send(err)
            }
            let taille = paris.length
            for(var i = 0; i<taille; i++){
                reponse += "Match: "+paris[i].pari.match.equipe1.nom+" vs "+paris[i].pari.match.equipe2.nom+" ("+paris[i].pari.match.date+" à "+paris[i].pari.match.date+")\n"
                reponse += "Pari: "+paris[i].pari.type.nom+": "+paris[i].pari.valeur+"\n"
                reponse += "Cote: "+paris[i].pari.cote+"\n"
                reponse += "Mise: "+paris[i].pari.mise+" Ar\n"
                reponse += "Gain: "+paris[i].pari.gain+" Ar\n"
                if(paris[i].pari.resultat == 0){
                    reponse += "Résultat: Match non terminé\n"
                }
                else if(paris[i].pari.resultat == 1){
                    sommeGagne += paris[i].pari.gain;
                    reponse += "Résultat: Gagné\n"
                }
                else if(paris[i].pari.resultat == 2){
                    sommePerdu += paris[i].pari.mise;
                    reponse += "Résultat: Perdu\n"
                }
                reponse += "-----------------\n"
            }
            reponse += "Résultat final: Vous avez gagné "+sommeGagne+" Ar et perdu "+sommePerdu+" Ar"
            res.json({message: reponse});
        });
    });

}

module.exports = { donneesQrCode, getNbPariByIdUtilisateur, revenuApplication, modifier, getPariByIdMatchAndValeur, getParisByIdPanier, toutSupprimer, ajout };
