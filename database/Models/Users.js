"use strict";

var bcrypt = require('bcryptjs');
var conf = require("../../config");
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define schema
var UserSchema = new Schema({
  user_id:Number,
  username: String,
  firstname:String,
  lastname:String,
  password: String,
  birthday: Date,
  poid: Number,
  start_smoking: Date,
  home_address:{
    address:String,
    lat:Number,
    lng:Number
  },
  work_address:{
    address:String,
    lat:Number,
    lng:Number
  }
}, {collection: 'users'});

var User = mongoose.model('User', UserSchema);

//Function to auto increment user_id
function getNextSequence(callback) {
  User.find().sort({user_id: -1}).limit(1).exec(function(err, user) {
    if (err) {
      callback(err.msg, null);
    } else if (user == null||user.length==0) {
      callback(null, -1)
    } else {
      callback(null, user[0].user_id);
    }
  });
}

function checkIfUserAlreadyExist(user,callback){
  User.findOne({username:user.username}).exec(function(err, user) {
    console.log(err,user);
    if (err) {
      callback(true);
    } else if (user == null) {
      callback(false);
    } else {
      callback(true);
    }
  });
}
var App = function() {
  var self = this;
  //add new user and encrypt his password into db
  this.adduser = function(newuser, callback) {
    checkIfUserAlreadyExist(newuser,function(exist){
      console.log(exist);
      if(exist) return callback('User already exists',null);
      //first get latest user_id
      getNextSequence(function(err, user_id) {
        if (err)
          return callback(err.msg, null);
          //encrypt password
        bcrypt.hash(newuser.password,conf.get("authentication:salt"), function(err, hash) {
          newuser.password = hash;
          //create new user from data
          newuser.user_id=user_id+1;
          var user = new User(newuser);
          //save it to db
          user.save(function(err) {
            if (err) {
              callback(err.msg, null);
            } else {
              callback(null, user_id+1);
            }
          });
        });
      });
    });
  };
  //Update a user with its id
  this.updateuser = function(id,data,callback) {
    if(data.password==null){
      //update to db
      User.update({user_id  : id}, {$set: data}, function(err,user){
        if(err) return callback(err.msg,null);
        callback(null,user);
      });
    }else{
      bcrypt.hash(data.password, conf.get("authentication:salt"), function(err, hash) {
        data.password = hash;
        //update to db
        User.update({user_id  : id}, {$set: data}, function(err,user){
          if(err) return callback(err.msg,null);
          callback(null,user);
        });
      });
    }
  };
  //get all users
  this.getalluser = function(callback){
    User.find({}, function(err,users){
      if(err)return callback(err.msg,null);
      callback(null,users);
    })
  }
  //get user by user_id
  this.getuser = function(id, callback) {
    User.findOne({
      user_id: id
    }, function(err, user) {
      if (err)
        return callback(err.msg, null);
      if(user==null) return callback("User "+ id + " not found",null);
      callback(null, user);
    });
  };
  //get user by username (for token checking)
  this.findbyusername = function(username, callback) {
    User.findOne({username: username}).lean().exec(function(err, user) {
      if (err)
        return callback(err.msg, null);
      callback(null, user);
    });
  };
  //Check if the password is a the same
  this.isValidPassword = function(hash, password, callback) {
    bcrypt.compare(password, hash, function(err, res) {
      callback(err, res);
    });

  };

  this._Model = User;
  this._Schema = UserSchema;
}
module.exports = new App();
