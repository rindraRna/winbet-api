let Match_paris = require('../model/match_paris');

function rechercheMulticritereSansEtat(req, res){
    var date = req.params.date;
    var equipe = req.params.equipe;
    var championnat = req.params.championnat;
    if(date === "null"){
        Match_paris.find(
            {
                $or: [
                    {
                        "equipe1.nom":  {
                            $regex: equipe,
                            $options: 'i'
                        }
                    },
                    {
                        "equipe2.nom":  {
                            $regex: equipe,
                            $options: 'i'
                        }
                    }
                ],
                "championnat.nom":  {
                    $regex: championnat,
                    $options: 'i'
                }
            }, (err, matchs) => {
            if(err){
                res.send(err)
            }
            res.send(matchs);
        });    
    } 
    else{
        Match_paris.find(
            {
                date: new Date(date),
                $or: [
                    {
                        "equipe1.nom":  {
                            $regex: equipe,
                            $options: 'i'
                        }
                    },
                    {
                        "equipe2.nom":  {
                            $regex: equipe,
                            $options: 'i'
                        }
                    }
                ],
                "championnat.nom":  {
                    $regex: championnat,
                    $options: 'i'
                }
            }, (err, matchs) => {
            if(err){
                res.send(err)
            }
            res.send(matchs);
        });
    }
}

function rechercheMulticritere(req, res){
    var date = req.params.date;
    var equipe = req.params.equipe;
    var championnat = req.params.championnat;
    var etat = Number(req.params.etat);
    if(date === "null"){
        Match_paris.find(
            {
                $or: [
                    {
                        "equipe1.nom":  {
                            $regex: equipe,
                            $options: 'i'
                        }
                    },
                    {
                        "equipe2.nom":  {
                            $regex: equipe,
                            $options: 'i'
                        }
                    }
                ],
                "championnat.nom":  {
                    $regex: championnat,
                    $options: 'i'
                },
                etat: etat
            }, (err, matchs) => {
            if(err){
                res.send(err)
            }
            res.send(matchs);
        });    
    } 
    else{
        Match_paris.find(
            {
                "date":  {
                    $regex: new Date(date),
                },
                $or: [
                    {
                        "equipe1.nom":  {
                            $regex: equipe,
                            $options: 'i'
                        }
                    },
                    {
                        "equipe2.nom":  {
                            $regex: equipe,
                            $options: 'i'
                        }
                    }
                ],
                "championnat.nom":  {
                    $regex: championnat,
                    $options: 'i'
                },
                etat: etat
            }, (err, matchs) => {
            if(err){
                res.send(err)
            }
            res.send(matchs);
        });
    }
}

function getMatchById(req, res){
    Match_paris.findOne({_id: req.params.id}, (err, match) =>{
        if(err){res.send(err)}
        res.json(match);
    })
}

function getMatchsByChampionnat(req, res){
    let championnatId = req.params.idChampionnat;
    Match_paris.find({"championnat._id": championnatId}, (err, matchs) => {
        if(err){
            res.send(err)
        }
        res.send(matchs);
    });
}

function getMatchs(req, res){
    Match_paris.find((err, matchs) => {
        if(err){
            res.send(err)
        }
        res.send(matchs);
    }).sort({date: -1});
}

module.exports = { rechercheMulticritereSansEtat, rechercheMulticritere, getMatchById, getMatchs, getMatchsByChampionnat };