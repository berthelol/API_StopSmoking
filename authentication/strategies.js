"use strict";

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var conf = require('../config');
var User = require("../database/Models/Users");

// Local strategy
passport.use(new LocalStrategy(
    function(username, password, done) {

        User.findbyusername(username, function(err, user) {
            if (err) {
                if(err.message == 'No result found') {
                    return done(null, false, { message: 'Incorrect username.' });
                } else {
                    return done(err);
                }
            }            
            if(user==null){
              return done(null,false,{message:'No user found'});
            }
            User.isValidPassword(user.password, password, function(err, res) {
                if (err) return done(err);
                if (res == true){
                  delete user.passport;
                  return done(null, user);
                }
                else return done(null, false, {message: 'Incorrect password.'});
            });
        });
    }
));


// Strategy pour les Tokens
var opts = {}
// Auth Header : Authorization : JWT <TOKEN>
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = conf.get("authentication:secret");

passport.use(new JwtStrategy(opts, function(payload, done) {

    User.getuser(payload.user_id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        done(null, user);

    });

}));
