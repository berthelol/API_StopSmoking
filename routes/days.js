var express = require('express');
var router = express.Router();
var token = require('../authentication/token');
var Day = require('../database/Models/Days.js');

/* GET last days listing. */
router.get('/last', function(req, res, next) {
  token.decode(req.headers.authorization.slice(4),function(err,user){
  Day.getlastday(user,function(err, day) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json(day);
  });
});
});
/* GET all days listing. */
router.get('/', function(req, res, next) {
  Day.getalldays(function(err, days) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json(days);
  });
});

/* GET one day detail. */
router.get('/:id', function(req, res, next) {
  token.decode(req.headers.authorization.slice(4),function(err,user){
  Day.getdaybydate(req.params.id,user, function(err, day) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json(day);
  });
});
});

/*POST new day*/
router.post('/', function(req, res, next) {
  token.decode(req.headers.authorization.slice(4),function(err,user){
  Day.addday(req.body,user,function(err, day) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json({success: true,id:day, msg: "Day well added"});
  });
  });
});

/*PATCH update new day*/
router.patch('/:id', function(req, res, next) {
  Day.updateday(req.params.id,req.body, function(err, result) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json({success: true,id:result, msg: "Day well updated"});
  });
});

module.exports = router;
