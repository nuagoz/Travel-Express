const express = require('express');
const router = express.Router();
const User = require('../models/User')

router.get('/', (req, res) => {
    User.getAllUsers((err, listUsers) => {
        if(err)
            res.json({success:false, message:`Failed to get users`});
        else{
            res.write(JSON.stringify({success: true, list:listUsers}), null, 2);
            res.end();
        }
    });
});

router.post('/', (req, res, next) => {
    // Création de l'utilisateur
    let newUser = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        mail: req.body.mail,
        tel: req.body.tel
    });

    User.addUser(newUser, (err, user) => {
        if(err)
            res.json({success: false, message: `Failed to create new user`})
        else{
            res.json({success:true, message: "Added successfully", user:user});
        }
    });

});

router.delete('/:id', (req, res, next) => {
    res.send("DELETE id");
});

module.exports = router;

