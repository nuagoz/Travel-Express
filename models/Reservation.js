const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ReservationSchema = mongoose.Schema({
    idTrajet: {
        type: Schema.Types.ObjectId, ref: 'Trajet',
        required: true
    }, 

    idPassager: {
        type: Schema.Types.ObjectId, ref: 'User',
        required : true
    }, 

    nbPassagers : {
        type : String, 
        required : true
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);