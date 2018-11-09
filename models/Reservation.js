const mongoose = require('mongoose');

let ReservationSchema = mongoose.Schema({
    idTrajet: {
        type: String,
        required: true
    }, 

    idPassager: {
        type : String, 
        required : true
    }, 

    nbPassagers : {
        type : String, 
        required : true
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);