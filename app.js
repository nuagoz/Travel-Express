const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const passport = require('passport');

// Appels des modeles (avant les routes !!)
require('./models/User');
require('./models/City');
require('./models/Trajet');
require('./models/Reservation');
// ...
require('./config/passport');

const routesApi = require('./routes/routes');

//Initialize our app variable
const app = express();

//Declaring Port
const port = process.env.PORT || '3000';

// Connect mongoose to our database

const options = { useNewUrlParser : true };
mongoose.connect(config.database, options);
mongoose.set('debug', true);

// Passport setup
app.use(passport.initialize());

//Middleware for CORS
app.use(cors());

//Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//app.use(express.static(path.join(__dirname, 'public')));

/* Use angular src on port 3000 */
app.use(express.static(path.join(__dirname, 'angular-src/dist/angular-src')));

/* ROUTING */
//app.use('/user', userController);
app.use('/api', routesApi); // Lien vers la liste des routes de l'API (a mettre avant le get '*' pour angular !!)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'angular-src/dist/angular-src/index.html'));
});

// Pour catch l'erreur dans le cas où un membre non authentifié essaye d'accéder à une route protégée
app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
        res.status(401);
        res.json({ message: err.name + ": " + err.message });
    }
});

app.set('port', port);

app.listen(port, () => console.log(`API running on port ${port}`));