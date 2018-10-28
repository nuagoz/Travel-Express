const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const userController = require('./controllers/user');

//Initialize our app variable
const app = express();

//Declaring Port
const port = process.env.PORT || '3000';

// Connect mongoose to our database
const options = { useNewUrlParser : true };
mongoose.connect(config.database, options);
mongoose.set('debug', true);

//Middleware for CORS
app.use(cors());

//Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

/* Use angular src on port 3000 */
app.use(express.static(path.join(__dirname, 'angular-src/dist/angular-src')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'angular-src/dist/angular-src/index.html'));
});

/* ROUTING */
app.use('/user', userController);

app.get('/', (req, res) => {
    res.send("ok");
});

app.set('port', port);

app.listen(port, () => console.log(`API running on port ${port}`));