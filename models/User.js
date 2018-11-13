const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

let UserSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    tel:String,
    prefFumeur : {
        type: Boolean,
        default: false
    },
    prefAnimaux : {
        type: Boolean,
        default: false
    },
    prefMusique: {
        type: Boolean,
        default: false
    },
    nbLiftsAsDriver: {
        type: Number,
        default: 0
    },
    hash:String,
    salt:String
});

UserSchema.methods.display = function() {
    console.log(this);
}
/**
 * Sécurisation du mot de passe lors de l'ajout d'un nouvel utilisateur
 * @param {*} password 
 */
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

/**
 * Méthode pour vérifier que le mot de passe entré par l'utilisateur est le bon
 * @param {} password 
 */
UserSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // Le token expire au bout de 7j

    return jwt.sign({
       _id: this._id,
       nom: this.nom,
       prenom: this.prenom,
       mail: this.mail,
       tel: this.tel,
       exp: parseInt(expiry.getTime() / 1000)
    }, "SECRET"); // "SECRET" -> Ne pas laisser dans le code, mettre dans une variable d'env. par exemple
};
module.exports = mongoose.model('User', UserSchema);
/*const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getAllUsers = (cb) => User.find(cb);
module.exports.addUser = (newUser, cb) => newUser.save(cb);
module.exports.deleteUserById = (id, cb) => User.remove({_id:id}, cb);*/