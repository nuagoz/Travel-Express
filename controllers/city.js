const express = require('express');
var mongoose = require('mongoose');
const Ville = mongoose.model('City');

module.exports.getCities = (req, res) => {
    Ville.find({}, (err, result) => {
        res.json({success:true, cities:result});
    });
};