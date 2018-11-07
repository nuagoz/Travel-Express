const mongoose = require('mongoose');

let CitySchema = mongoose.Schema({
    nom: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('City', CitySchema);