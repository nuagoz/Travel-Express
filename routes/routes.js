const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();
const userController = require('../controllers/user');
const trajetController = require('../controllers/trajet');
const cityController = require('../controllers/city');

const auth = jwt({
    secret: 'SECRET', // securite : mettre le secret dans une variable d'env.
    userProperty: 'payload'
});

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/profile', auth, userController.getUser);
router.post('/trajet', trajetController.addTrajet);
router.post('/search', trajetController.search);
router.get('/board', auth, userController.board); 
router.post('/reservation', auth, trajetController.reservation);
router.get('/cities', cityController.getCities);

module.exports = router;