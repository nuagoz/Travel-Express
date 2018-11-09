const express = require('express');
const router = express.Router();
const passport = require('passport');
var mongoose = require('mongoose');
var Trajet = mongoose.model('Trajet');
const Ville = mongoose.model('City');
const City = mongoose.model('City');

module.exports.addTrajet = (req, res) => {

    let trajet = new Trajet(); 

    trajet.idConducteur = req.body.idConducteur; 
    trajet.date = req.body.date;
    trajet.nbPlaces = req.body.nbPlaces; 
    trajet.tarif = req.body.tarif;
    trajet.heureDepart = req.body.heureDepart;


    Ville.findOne({ nom:depart}, (err, villedep) => {
        if (err){
            res.json({success:false, msg:'error'}); 
        }
        if(villedep){
            trajet.idVilleDepart = villedep._id;
            Ville.findOne({nom:req.body.villeArrivee}, (err, villearr) => {
                if (err){
                    res.json({success:false, msg:'error'}); 
                }
                if (villearr){
                    trajet.idVilleArrivee = villearr._id;
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
    });
};

module.exports.search = (req, res) => {

    res.json({test: req.body.date});

    Ville.findOne({nom:req.body.villeDepart}, (err, villedep) => {
        if (err)
            res.json({success:false, msg:'error'}); 

        if (!villedep)
            res.json({success:false, msg:'Departure not found'}); 
        else {
            Ville.findOne({nom:req.body.villeArrivee}, (err,villearrivee) => {
                if (err)
                    res.json({success:false, msg : 'error'}); 
                if (!villearrivee)
                    res.json({success:false, msg:'Arrival not found'}); 
                else {
                    Trajet.find({idVilleDepart:villedep._id, idVilleArrivee:villearrivee, date:req.body.date}, (err, trajets) => {
                        if (err)
                            res.json({succes:false, msg:'error'}); 
                        if (!trajets)
                            res.json({succes:false, msg:'No trajets founds'}); 
                        else 
                            res.json({success:true, resultTrajets:trajets}); 
                        
                    })
                }
            })
        }
    })
};
