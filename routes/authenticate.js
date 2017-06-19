"use strict";

var express = require('express');
var router = express.Router();
var auth = require("../authentication");
var User = require("../database/Models/Users");

router.post("/token/local", auth.authenticate("local"), function(req, res, next) {

    auth.token(req.user, function(err, token) {
    	if(err) return next(err);
        res.status(200).json({
            token: token
        });
    });
});

/*  User.findbyusername("infomeless",function(err,user){
    res.status(200).json({
        user: user
    });
  })

});*/

module.exports = router;
