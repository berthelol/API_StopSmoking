"use strict";

var passport = require("passport-jwt");
var jwt = require('jsonwebtoken');
var conf = require('../config/');



module.exports= {
  create: function(payload,cb) {
		var opts = { expiresIn:"1d" };
    delete payload.password;
		jwt.sign(payload, conf.get('authentication:secret'), { algorithm: 'HS256' }, function(err, token) {
			cb(err, token);
		});
	},
	verify: function(token, callback) {
	    jwt.verify(token, conf.get('authentication:secret'), callback);
	},
  decode: function(token,callback){
    // verify a token symmetric
    jwt.verify(token, conf.get('authentication:secret'), callback);
  }
}
