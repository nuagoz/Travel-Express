const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    nom: {
        type: String,
        require: true
    },
    prenom: {
        type: String,
        require: true
    },
    mail: {
        type: String,
        require: true
    },
    tel: {
        type:String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getAllUsers = (cb) => User.find(cb);
module.exports.addUser = (newUser, cb) => newUser.save(cb);
module.exports.deleteUserById = (id, cb) => User.remove({_id:id}, cb);
