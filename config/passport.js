const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
var User = mongoose.model('User');
console.log("strat")
passport.use(new localStrategy({
        usernameField: 'mail'
    },
    (username, password, done) => {
        User.findOne({ mail: username }, (err, user) => {
            if(err)
                return done(err);
            if(!user)
                return done(null, false, { message: 'User not found' });
            if(!user.validPassword(password))
                return done(null, false, { message: 'Wrong password' });
            
            return done(null, user); // Identification reussie
        });
    }
));