const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TrajetSchema = mongoose.Schema({
    idConducteur: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },

    date: {
        type : String, 
        required : true
    }, 

    idVilleDepart : {
        type: Schema.Types.ObjectId, ref: 'City',
        required : true
    }, 

    idVilleArrivee : {
        type: Schema.Types.ObjectId, ref: 'City',
        required : true
    },

    nbPlaces : {
        type : String, 
        required : true
    }, 

    tarif : {
        type : String, 
        required : true
    },

    heureDepart : {
        type : String, 
        required : true
    },
    heureArrivee: {
        type: String,
        required:true
    }
});

module.exports = mongoose.model('Trajet', TrajetSchema);