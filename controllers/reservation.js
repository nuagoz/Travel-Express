var mongoose = require('mongoose');
const Trajet = mongoose.model('Trajet');
const Reservation = mongoose.model('Reservation');
const moment = require('moment');

module.exports.reservation = (req, res) => {
    if(!req.payload._id) // pas d'ID utilisateur existe dans le JWT
        res.status(401).json({ message: "UnauthorizedError: private profile" });

    else {
        let reservation = new Reservation(); 
    
        reservation.nbPassagers = req.body.nbPassagers; 
        reservation.idTrajet = req.body.idTrajet;
        reservation.idPassager = req.body.idPassager;

        // Vérifier que le nombre de place réservé est dispo
        Trajet.findById(req.body.idTrajet, (err, response) => {
            if(err)
                res.json({success:false, msg:'Failed to add reservation'});
            if(!response)
                res.json({success:false});
            else { // Le trajet existe, on verifie s'il y a la place dispo pour le reserver
                Reservation.find({idTrajet:reservation.idTrajet}, (err, reservations) => {
                    let seatsBooked = getSeatsBooked(reservations);
                    let availableSeats = response.nbPlaces - seatsBooked;

                    if(availableSeats < reservation.nbPassagers)
                        res.json({success:false, msg:`Vous essayez de réserver ${reservation.nbPassagers} places alors qu'il n'en reste que ${availableSeats}`});
                    else if(moment(response.date) < moment())
                        res.json({success:false, msg:`Réservation impossible, la date de ce trajet est passée`});
                    else if(new String(reservation.idPassager).valueOf() === new String(response.idConducteur).valueOf())
                        res.json({success:false, msg:`Vous ne pouvez pas réserver un trajet qui vous appartient`});
                    else { // OK
                        reservation.save(err => {
                            if (err){
                                res.json({success:false, msg:'Failed to add reservation'});
                            }
                            res.json({success:true, reservation : reservation});
                        });
                    }
                })
            }
        })
    }

};

module.exports.getReservations = (req, res) => {
    let idTrajet = req.query.idTrajet;
    Reservation.find({idTrajet:idTrajet}).populate('idTrajet').populate('idPassager').exec((err, reservations) => {
        if (err)
            res.json({succes:false, msg:'error'}); 
        if (!reservations)
            res.json({succes:false, msg:'No bookings founds for this lift'}); 
        else {
            let seatsBooked = getSeatsBooked(reservations);
            res.json({success:true, bookings:reservations, seatsBooked:seatsBooked});
        } 
    });
}

const getSeatsBooked = list => {
    let calc = 0;
    for(let el of list)
        calc += parseInt(el.nbPassagers);
    return calc;
};