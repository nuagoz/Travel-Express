const express = require('express');
const router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
const Trajet = mongoose.model('Trajet');
const Reservation = mongoose.model('Reservation');

module.exports.login = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        let token;
        if(err) { // utilisateur inconnu
            res.status(404).json(err);
            return;
        }

        if(user){ // connexion ok
            console.log("connexion OK")
            token = user.generateJwt();
            res.status(200);
            res.json({ token: token });
        }
        else { // mauvais mot de passe
            res.status(401).json(info);
        }
    })(req, res);
};

module.exports.register = (req, res, next) => {

    // Vérification que l'utilisateur a rempli les champs
    let formFields = [
        { key: "prenom", value: "Prénom"},
        { key: "nom", value: "Nom"},
        { key: "mail", value: "Mail"},
        { key: "tel", value: "Téléphone"},
        { key: "password1", value: "Mot de passe 1"},
        { key: "password2", value: "Mot de passe 2"}
    ];

    for(let field of formFields) {
        if(!req.body[field.key])
            res.json({ success: false, field:field.key, msg: `Le champ ${field.value} est obligatoire !`});
    }
    
    // Création de l'utilisateur
    let user = new User();

    user.prenom = req.body.prenom;
    user.nom = req.body.nom;
    user.mail = req.body.mail;
    user.tel = req.body.tel;

    // Vérification que l'utilisateur a rempli les champs
    
    if(req.body.password1 === req.body.password2)
        req.body.password = req.body.password1;
    else
        res.json({ success: false, msg:'Les mots de passe sont différents'})

    // Vérification que l'email n'est pas déjà utilisé
    User.findOne({ mail:user.mail }, (err, userfound) => {
        if(err)
            res.json( {success: false, msg: err });
        if(userfound) // un utilisateur possede déjà cet email
            res.json( {success: false, msg: 'L\'adresse mail est déjà utilisée' });
        else {
            user.setPassword(req.body.password); // on definit le hash pour son mot de passe
            user.save(err => {
                if(err)
                    res.json({success:false, msg:`Failed to add user`});
        
                //let token = user.generateJwt();
                //res.status(200);
                res.json({ success: true });
            });
        }
    });
};

// gérer + de cas, comme quand l'utilisateur n'est pas trouvé
module.exports.getUser = (req, res) => {
    if(!req.payload._id) // pas d'ID utilisateur existe dans le JWT
        res.status(401).json({ message: "UnauthorizedError: private profile" });
    else {
        User
        .findById(req.payload._id)
        .exec((err, user) => {
            res.status(200).json(user);
        });
    }
};

module.exports.setPreferences = (req, res) => {
    let toSet = {};
    toSet['prefFumeur'] = req.body.cigarette;
    toSet['prefAnimaux'] = req.body.animaux;
    toSet['prefMusique'] = req.body.musique;
    User.update({ _id: req.body.userId }, { $set: toSet }, (err, raw) => {
        res.json({success:true });
    });
}

module.exports.board = (req,res) => {

    if(!req.payload._id) // pas d'ID utilisateur existe dans le JWT
        res.status(401).json({ message: "UnauthorizedError: private profile" });
    
    else {
        User.findById(req.payload._id, (err,user) => {
            if (err)
                res.json({success:false, msg:'error'}); 
            if (!user)
                res.json({success:false, msg:'User not found'}); 
            else {
                Trajet.find({idConducteur:user._id}).sort('-date').exec((err, trajetsProposes) => {
                    if (err)
                        res.json({success:false, msg:'error'});
                    Reservation.find({idPassager:user._id})
                    .populate({path:'idTrajet', options: { sort: '-date' }, populate: [
                        { path:'idVilleDepart' }, 
                        { path:'idVilleArrivee'},
                        { path:'idConducteur'}
                    ] })
                    .populate('idPassager')
                    .exec((err, trajetsReserves) => {
                        if (err) 
                            res.json({succes:false, msg: 'error'}); 
                        res.json({success:true, user:user, trajetsProposes: trajetsProposes, trajetsReserves:trajetsReserves});
                    })
                    
                })
            }
        

        }); 
    }
    
}
//module.exports = router;

