"use strict";

var passport = require("passport");
var token = require("./token");
var strategies = require("./strategies");

module.exports = {
    initialize: function(){
      	return passport.initialize();
    },
    // Apporte une abstraction au dessus de authenticate. On supprime tjs le cache
    authenticate: function(arg){
      	return passport.authenticate(arg, {session: false});
    },
    verify : token.verify,
    token: token.create
};
