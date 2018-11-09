const express = require('express');
const router = express.Router();
const passport = require('passport');
var mongoose = require('mongoose');
const Trajet = mongoose.model('Trajet');
const Ville = mongoose.model('City');
const User = mongoose.model('User');
const Reservation = mongoose.model('Reservation'); 

module.exports.addTrajet = (req, res) => {

    let trajet = new Trajet(); 
    console.log(req.body);

    trajet.idConducteur = req.body.idConducteur; 
    trajet.date = req.body.date;
    trajet.nbPlaces = req.body.nbPlaces; 
    trajet.tarif = req.body.tarif;
    trajet.heureDepart = req.body.heureDepart;


    Ville.findOne({nom:req.body.villeDepart}, (err, villedep) => {
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

    Ville.findOne({nom:req.body.villeDepart}, (err, villedep) => {
        if (err)
            res.json({success:false, msg:'error 1'}); 

        if (!villedep)
            res.json({success:false, msg:'Departure not found'}); 
        
        else {
            idDepart = villedep._id;
            Ville.findOne({nom:req.body.villeArrivee}, (err,villearrivee) => {
                if (err)
                    res.json({success:false, msg : 'error 2'}); 
                if (!villearrivee)
                    res.json({success:false, msg:'Arrival not found'}); 
                else {
                    
                    Trajet.find({idVilleDepart : villedep._id , idVilleArrivee:villearrivee._id, date:req.body.date}, (err, trajets) => {
                        if (err)
                            res.json({succes:false, msg:'error 3'}); 
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

module.exports.reservation = (req, res) => {
    if(!req.payload._id) // pas d'ID utilisateur existe dans le JWT
        res.status(401).json({ message: "UnauthorizedError: private profile" });

    else {
        let reservation = new Reservation(); 
    
        reservation.nbPassagers = req.body.nbPassagers; 
        reservation.idTrajet = req.body.idTrajet;
        console.log('test');
        
        User.findById(req.payload._id, (err,user) => {
            
            if (err)
                res.json({success:false, msg:'error'}); 
            if (!user)
                res.json({success:false, msg:'User not found'}); 

            reservation.idPassager = user._id; 
            
            reservation.save(err => {
                if (err){
                    res.json({success:false, msg:'Failed to add reservation'});
                }
                res.json({success:true, reservation : reservation});
            })
        });
    }

};