let Match_paris = require('../model/match_paris');
let pari = require('../routes/pari');

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
    Match_paris.find({"championnat._id": championnatId, "etat": 0}, (err, matchs) => {
        if(err){
            res.send(err)
        }
        res.send(matchs);
    }).sort({date: -1});
}

function getMatchs(req, res){
    Match_paris.find((err, matchs) => {
        if(err){
            res.send(err)
        }
        res.send(matchs);
    }).sort({date: -1});
}

function getMatchsPariable(req, res){
    Match_paris.find({"etat": 0}, (err, matchs) => {
        if(err){
            res.send(err)
        }
        res.send(matchs);
    }).sort({date: -1});
}

function ajout(req, res){
    let match = new Match_paris();
    match.equipe1 = req.body.equipe1;
    match.equipe2 = req.body.equipe2;
    match.etat = 0;
    match.date = req.body.date;
    match.stade = req.body.stade;
    match.endroit = req.body.endroit;
    match.championnat = req.body.championnat;
    match.rendu = "";

    match.save( (err) => {
        if(err){
            res.send('cant post match: ', err);
        }
        res.json({ message: match._id})
    })
}

function dernierMatchInsere(){
    console.log("dernier id match: "+Match_paris._id)
}

function ajoutMatchEtParis(req, res){
    // Start a session.
    session = db.getMongo().startSession( { readPreference: { mode: "primary" } } );

    // Start a transaction
    session.startTransaction( { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } } );

    // Operations inside the transaction
    try {
        this.ajout(req, res);
        pari.ajout(req, res);
    } catch (error) {
        // Abort transaction on error
        session.abortTransaction();
        throw error;
    }

    // Commit the transaction using write concern set at transaction start
    session.commitTransaction();

    session.endSession();
}

function modifier(req, res) {
    Match_paris.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, match) => {
        if (err) {
            res.send(err)
        } else {
          res.json({message: `le match ${match._id} a été modifié`})
        }
    });
}

function supprimer(req, res) {
    Match_paris.findByIdAndRemove(req.params.id, (err, match) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${match._id} deleted`});
    })
}

module.exports = { getMatchsPariable, supprimer, modifier, dernierMatchInsere, ajoutMatchEtParis, ajout, rechercheMulticritereSansEtat, rechercheMulticritere, getMatchById, getMatchs, getMatchsByChampionnat };