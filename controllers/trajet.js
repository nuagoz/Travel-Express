const express = require('express');
const router = express.Router();
const passport = require('passport');
var mongoose = require('mongoose');
<<<<<<< Updated upstream
var Trajet = mongoose.model('Trajet');
//const Ville = mongoose.model('Ville');
=======
const Trajet = mongoose.model('Trajet');
const Ville = mongoose.model('City');
>>>>>>> Stashed changes

module.exports.addTrajet = (req, res) => {

    let trajet = new Trajet(); 

    trajet.idConducteur = req.body.idConducteur; 
    trajet.date = req.body.date;
    trajet.nbPlaces = req.body.nbPlaces; 
    trajet.tarif = req.body.tarif;

    /*Ville.findOne({ nom:req.body.villeDepart}, (err, ville) => {
        if (err){
            res.json({success:false, msg:'error'}); 
        }
        if(ville){
            trajet.idVilleDepart = ville._id;
            Ville.findOne({nom:req.body.villeArrivee}, (err, ville) => {
                if (err){
                    res.json({success:false, msg:'error'}); 
                }
                if (ville){
                    trajet.idVilleArrivee = ville._id;
                    trajet.save(err => {
                        if (err){
                            res.json({success:false, msg:`Failed to add trajet`});
                        }
                        res.json({success:true, trajet : trajet});
                    })
                }
                else
                    res.json({success:false, msg:"Arrival not found"});
            })
        }
        else 
            res.json({success : false, msg : "Departure not found"}); 
    });*/

};