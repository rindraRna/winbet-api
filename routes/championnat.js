let Championnat = require('../model/championnat');

function getChampionnats(req, res){
    Championnat.find((err, championnats) => {
        if(err){
            res.send(err)
        }
        res.send(championnats);
    }).sort({nom: 1});
}

function getChampionnatById(req, res){
    Championnat.findOne({_id: req.params.id}, (err, championnat) =>{
        if(err){res.send(err)}
        res.json(championnat);
    })
}

function getChampionnatByNom(req, res){
    Championnat.findOne({nom: req.params.nom}, (err, championnat) =>{
        if(err){res.send(err)}
        res.json(championnat);
    })
}

function ajout(req, res){
    let championnat = new Championnat();
    championnat.nom = req.body.nom;
    championnat.save( (err) => {
        if(err){
            res.send('cant post championnat ', err);
        }
        res.json({ message: `${championnat.nom} saved!`})
    })
}

function modifier(req, res) {
    Championnat.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, championnat) => {
        if (err) {
            res.send(err)
        } else {
          res.json({message: `${championnat.nom} updated`})
        }
    });

}

function supprimer(req, res) {
    Championnat.findByIdAndRemove(req.params.id, (err, championnat) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${championnat.nom} deleted`});
    })
}

function recherche(req, res){
    var nom = req.params.nom;
    Championnat.find(
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



module.exports = { recherche, supprimer, modifier, ajout, getChampionnatByNom, getChampionnats, getChampionnatById };
