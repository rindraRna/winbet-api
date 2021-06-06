let Equipe = require('../model/equipe');

function getEquipes(req, res){
    Equipe.find((err, equipes) => {
        if(err){
            res.send(err)
        }
        res.send(equipes);
    }).sort({nom: 1});
}

function getEquipeById(req, res){
    Equipe.findOne({_id: req.params.id}, (err, equipe) => {
        if(err){
            res.send(err)
        }
        res.send(equipe);
    });
}

function getEquipeByNom(req, res){
    Equipe.findOne({nom: req.params.nom}, (err, equipe) => {
        if(err){
            res.send(err)
        }
        res.send(equipe);
    });
}

function recherche(req, res){
    var nom = req.params.nom;
    Equipe.find(
            {
                "nom":  {
                    $regex: nom,
                    $options: 'i'
                }
            }, (err, equipes) => {
            if(err){
                res.send(err)
            }
            res.send(equipes);
        });    
}

function ajout(req, res){
    let equipe = new Equipe();
    equipe.nom = req.body.nom;
    equipe.save( (err) => {
        if(err){
            res.send('cant post equipe ', err);
        }
        res.json({ message: `${equipe.nom} saved!`})
    })
}

function modifier(req, res) {
    Equipe.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, equipe) => {
        if (err) {
            res.send(err)
        } else {
          res.json({message: `${equipe.nom} updated`})
        }
    });
}

function supprimer(req, res) {
    Equipe.findByIdAndRemove(req.params.id, (err, equipe) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${equipe.nom} deleted`});
    })
}

module.exports = { ajout, modifier, supprimer, getEquipeById, recherche, getEquipeByNom, getEquipes };