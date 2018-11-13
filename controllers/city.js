var mongoose = require('mongoose');
const Ville = mongoose.model('City');

module.exports.getCities = (req, res) => {
    Ville.find().sort('nom').exec((err, result) => {
        res.json({success:true, cities:result});
    });
};