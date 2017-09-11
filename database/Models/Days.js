"use strict";

var conf = require("../../config");
// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define schema
var DaySchema = new Schema({
  day_id:Number,
  date: String,
  cigarettes:[{ type : mongoose.Schema.Types.ObjectId, ref: 'Cigarette'}],
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {collection: 'days'});

var Day = mongoose.model('Day', DaySchema);
//Function to auto increment Cigarette_id
function getNextSequence(callback) {
  Day.find().sort({day_id: -1}).limit(1).exec(function(err, day) {
    if (err) {
      callback(err.msg, null);
    } else if (day == null||day.length==0) {
      callback(null, -1)
    } else {
      callback(null, day[0].day_id);
    }
  });
}
var App = function() {
  var self = this;
  //add new day and encrypt his password into db
  //check getdayid
  this.addday = function(newday,user,callback) {
    getNextSequence(function(err, day_id) {
      if (err)
        return callback(err.msg, null);
        console.log(format_day(newday.date));
        var day = new Day({
          day_id: day_id + 1,
          date: format_day(newday.date),
          cigarettes:[],
          user:user._id
        });
        //save it to db
        day.save(function(err) {
          if (err) {
            callback(err.msg, null);
          } else {
            callback(null, day);
          }
    });
  });
  };
  //Update a day with its id
  this.updateday = function(id,data,callback) {
    if(data.password==null){
      //update to db
      Day.update({day_id  : id}, {$set: data}, function(err,day){
        if(err) return callback(err.msg,null);
        callback(null,day);
      });
    }else{
        //update to db
        Day.update({day_id  : id}, {$set: data}, function(err,day){
          if(err) return callback(err.msg,null);
          callback(null,day);
        });
    }
  };
  //get all days
  this.getalldays = function(user,callback){
    Day.find({user:user._id}).populate('cigarettes').exec(function(err,days){
      if(err)return callback(err.msg,null);
      callback(null,days);
    });
  }
  //get day by day_id
  this.getday = function(id, callback) {
    Day.findOne({
      day_id: id
    }, function(err, day) {
      if (err)
        return callback(err.msg, null);
      if(day==null) return callback("Day "+ id + " not found",null);
      callback(null, day);
    });
  };
  //get day by date
  this.getdaybydate = function(day_id,user, callback) {
    Day.findOne({
      day_id: day_id,user:mongoose.Types.ObjectId(user._id)
    }, function(err, day) {
      if (err)
        return callback(err.msg, null);
      if(day==null) return callback("Day with "+ day_id + " not found",null);
      callback(null, day);
    });
  };
  //get last day
  this.getlastday = function(user,callback){
    Day.findOne({user:user._id}).populate('cigarettes').sort({day_id: -1}).exec(function(err, day) {
      if (err)
        return callback(err.msg, null);
        callback(null,day);
    });
  }
  this.getdayid = function(date,user,callback){
    Day.findOne({date: format_day(date), user:user._id},function(err,day){
      if(err)return callback(err.msg,null);
      if(day == null){
        self.addday({date:date},user,function(err,day){
          return callback(null,day._id);
        });
      }else {
        callback(null,day._id);
      }

    });
  }
  this.addcigarette = function(cig_id,day_id,callback){
    Day.findByIdAndUpdate(day_id,{$push:{"cigarettes":mongoose.Types.ObjectId(cig_id)}},
    {safe: true, upsert: true},function(err,cig){
      if(err) return callback(err.msg,null);
      callback(null,cig);
    });
  }
  this.findCigaretteAndRemove = function(cigarette,cb){
    Day.update( {_id: cigarette.day}, { $pullAll: {cigarettes: [cigarette._id] } },function(err){
      if(err) return cb(err);
      return cb(null)
    } );
  }
  this._Model = Day;
  this._Schema = DaySchema;
}
function format_day(day){
  var date = new Date(day);
  return (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}
module.exports = new App();
