const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();
const userController = require('../controllers/user');
const trajetController = require('../controllers/trajet');

const auth = jwt({
    secret: 'SECRET', // securite : mettre le secret dans une variable d'env.
    userProperty: 'payload'
});

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/profile', auth, userController.getUser);
router.post('/trajet', trajetController.addTrajet);

module.exports = router;