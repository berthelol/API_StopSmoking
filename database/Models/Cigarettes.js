"use strict";

var conf = require("../../config");
var Day = require('./Days');
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
// define schema
var CigaretteSchema = new Schema({
  cigarette_id: Number,
  day:{ type: mongoose.Schema.Types.ObjectId, ref: 'Day' },
  time: Number,
  lat: Number,
  lng: Number,
  price: Number,
  currency:String,
  label:String,
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {collection: 'cigarettes'});

var Cigarette = mongoose.model('Cigarette', CigaretteSchema);

//Function to auto increment Cigarette_id
function getNextSequence(callback) {
  Cigarette.find().sort({cigarette_id: -1}).limit(1).exec(function(err, cigarette) {
    if (err) {
      callback(err.msg, null);
    } else if (cigarette == null||cigarette.length==0) {
      callback(null, -1)
    } else {
      callback(null, cigarette[0].cigarette_id);
    }
  });
}
var App = function() {
  var self = this;
  //add new cigarette and encrypt his password into db
  this.addcigarette = function(newcigarette,user, callback) {
    //Get the day id
    Day.getdayid(newcigarette.date,user,function(err,day_id){
      //first get latest cigarette_id
      getNextSequence(function(err, cigarette_id) {
        if (err)
          return callback(err.msg, null);
          //create new cigarette from data
          var cigarette = new Cigarette({
            cigarette_id: cigarette_id + 1,
            time: newcigarette.time,
            lat:newcigarette.lat,
            lng:newcigarette.lng,
            price: newcigarette.price,
            user:user._id,
            day:day_id,
            label:newcigarette.label
          });
          //save it to db
          cigarette.save(function(err,cig) {
            if (err) {
              callback(err.msg, null);
            } else {
              //add cigarette to corresponding day array
              Day.addcigarette(cig._id,day_id,function(err,result){
                if(err)return callback(err.msg,null);
                  callback(null, cigarette_id+1);
              });
            }
          });
    });

    });
  };
  //Update a cigarette with its id
  this.updatecigarette = function(id,data,callback) {
    if(data.password==null){
      //update to db
      Cigarette.update({cigarette_id  : id}, {$set: data}, function(err,cigarette){
        if(err) return callback(err.msg,null);
        callback(null,cigarette);
      });
    }else{
      bcrypt.hash(data.password, conf.get("authentication:round"), function(err, hash) {
        data.password = hash;
        //update to db
        Cigarette.update({cigarette_id  : id}, {$set: data}, function(err,cigarette){
          if(err) return callback(err.msg,null);
          callback(null,cigarette);
        });
      });
    }
  };
  //get all cigarettes
  this.getallcigarettesfromuser = function(user,callback){
    console.log(user);
    Cigarette.find({user:user._id}).populate('user').populate('day').exec(function(err,cigarettes){
      if(err)return callback(err.msg,null);
      callback(null,cigarettes);
    });
  }
  //get cigarette by cigarette_id
  this.getcigarette = function(id, callback) {
    Cigarette.findOne({
      cigarette_id: id
    }, function(err, cigarette) {
      if (err)
        return callback(err.msg, null);
      if(cigarette==null) return callback("Cigarette "+ id + " not found",null);
      callback(null, cigarette);
    });
  };
  this.getlastcigarette = function(user,callback){
    Cigarette.findOne({user:user._id}).sort({cigarette_id: -1}).exec(function(err, cigarette) {
      if (err)
        return callback(err.msg, null);
        callback(null,cigarette);
    });
  }

  this._Model = Cigarette;
  this._Schema = CigaretteSchema;
}
module.exports = new App();
