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

// // Ajout d'un assignment (POST)
// function postAssignment(req, res){
//     let assignment = new Assignment();
//     assignment.id = req.body.id;
//     assignment.nom = req.body.nom;
//     assignment.dateDeRendu = req.body.dateDeRendu;
//     assignment.rendu = req.body.rendu;

//     console.log("POST assignment reçu :");
//     console.log(assignment)

//     assignment.save( (err) => {
//         if(err){
//             res.send('cant post assignment ', err);
//         }
//         res.json({ message: `${assignment.nom} saved!`})
//     })
// }

// // Update d'un assignment (PUT)
// function updateAssignment(req, res) {
//     console.log("UPDATE recu assignment : ");
//     console.log(req.body);
//     Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
//         if (err) {
//             console.log(err);
//             res.send(err)
//         } else {
//           res.json({message: 'updated'})
//         }

//       // console.log('updated ', assignment)
//     });

// }

// // suppression d'un assignment (DELETE)
// function deleteAssignment(req, res) {

//     Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
//         if (err) {
//             res.send(err);
//         }
//         res.json({message: `${assignment.nom} deleted`});
//     })
// }



module.exports = { getChampionnats, getChampionnatById };
