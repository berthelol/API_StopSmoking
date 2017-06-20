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
  this.addday = function(newday, callback) {
    getNextSequence(function(err, day_id) {
      if (err)
        return callback(err.msg, null);
        var day = new Day({
          day_id: day_id + 1,
          date: format_day(newday.date),
          cigarettes:[],
          user:mongoose.Types.ObjectId("594222d9b93a951f6f6bc558")
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
  this.getalldays = function(callback){
    Day.find({}).populate('user').exec(function(err,days){
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
  //get last day
  this.getlastday = function(callback){
    Day.findOne().sort({day_id: -1}).exec(function(err, day) {
      if (err)
        return callback(err.msg, null);
        callback(day,null);
    });
  }
  this.getdayid = function(date,callback){
    console.log(format_day(date));
    Day.findOne({date: format_day(date), user:mongoose.Types.ObjectId("594222d9b93a951f6f6bc558")},function(err,day){
      if(err)return callback(err.msg,null);
      if(day == null){
        this.addday({date:date},function(err,day){
          callback(null,day._id);
        });
      }

      callback(null,day._id);
    });
  }
  this.addcigarette = function(cig_id,day_id,callback){
    Day.findByIdAndUpdate(day_id,{$push:{"cigarettes":mongoose.Types.ObjectId(cig_id)}},
    {safe: true, upsert: true},function(err,cig){
      if(err) return callback(err.msg,null);
      callback(null,cig);
    })
  }
  this._Model = Day;
  this._Schema = DaySchema;
}
function format_day(day){
  var date = new Date(day);
  return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

}
module.exports = new App();
