const mongoose = require('mongoose');

let TrajetSchema = mongoose.Schema({
    idConducteur: {
        type: String,
        required: true
    }, 

    date: {
        type : String, 
        required : true
    }, 

    idVilleDepart : {
        type : String, 
        required : true
    }, 

    idVilleArrivee : {
        type : String, 
        required : true
    }

});

module.exports = mongoose.model('Trajet', TrajetSchema);