var mongoose = require('mongoose');
const Trajet = mongoose.model('Trajet');
const Ville = mongoose.model('City');
const User = mongoose.model('User');
const moment = require('moment');

module.exports.addTrajet = (req, res) => {

    // Vérification que l'utilisateur a rempli les champs
    let formFields = [
        { key: "villeDepart", value: "Ville de départ"},
        { key: "villeArrivee", value: "Ville d'arrivée"},
        { key: "date", value: "Date"},
        { key: "heureDepart", value: "Heure de départ"},
        { key: "heureArrivee", value: "Heure d'arrivée"},
        { key: "nbPlaces", value: "Nombre de places"},
        { key: "tarif", value: "Prix"}
    ];

    for(let field of formFields) {
        if(!req.body[field.key])
            res.json({ success: false, field:field.key, msg: `Le champ ${field.value} est obligatoire !`});
    }

    let trajet = new Trajet();
    
    trajet.date = req.body.date;
    trajet.nbPlaces = req.body.nbPlaces; 
    trajet.tarif = req.body.tarif;
    trajet.heureDepart = req.body.heureDepart;
    trajet.heureArrivee = req.body.heureArrivee;
    trajet.idConducteur = req.body.idConducteur;

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
                            console.log("ERR !!", err);
                            res.json({success:false, msg:`Failed to add trajet`});
                        }
                        User.update({_id:trajet.idConducteur}, { $inc: { nbLiftsAsDriver: 1 }}, (err, raw) => {
                            res.json({success:true});
                        }); // On ajoute 1 trajet au conducteur
                        
                    });
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

    let searchFilter = {};

    if(req.body.date)
        searchFilter["date"] = req.body.date;

    Ville.findOne({nom:req.body.villeDepart}, (err, villedep) => {
        if (err)
            res.json({success:false, msg:'error 1'}); 

        if (villedep) {
            searchFilter["idVilleDepart"] = villedep._id;
        }
        
        else if(!villedep) { // ville de départ n'existe pas
        }

        Ville.findOne({nom:req.body.villeArrivee}, (err,villearrivee) => {
            if (err)
                res.json({success:false, msg : 'error 2'}); 
            if (villearrivee)
                searchFilter["idVilleArrivee"] = villearrivee._id;
            else if(!villearrivee){ // ville arrivee n'existe pas
                
            }

            Trajet.find(searchFilter)
            .sort('-date')
            .populate('idVilleDepart')
            .populate('idVilleArrivee')
            .exec((err, trajets) => {
                if (err)
                    res.json({succes:false, msg:'error'}); 
                if (!trajets)
                    res.json({succes:false, msg:'No trajets founds for this search'}); 
                else {
                    res.json({success:true, resultTrajets:trajets});
                }        
            });

        });

    });

    
};

module.exports.getTrajet = (req, res) => {
    Trajet.findById(req.params.id)
    .populate('idVilleDepart')
    .populate('idVilleArrivee')
    .populate('idConducteur')
    .exec((err, result) => {
        if(err)
            res.json({success:false});
        else if(result) 
            res.json({success:true, result:result});
        else if(!result)
            res.json({success:false});
    });
}