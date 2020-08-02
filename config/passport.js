const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const keys = require('../config/keys');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        // This payload includes the items we specified earlier
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user); // return the user to the frontend
                }
                return done(null, false); // return false since there is no user
            })
            .catch(err => console.log(err));
    }));
}; 
