var express = require('express');
var router = express.Router();
var Day = require('../database/Models/Days.js');
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
router.get('/:day', function(req, res, next) {
  Day.getday(req.params.id, function(err, day) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json(day);
  });
});

/*POST new day*/
router.post('/', function(req, res, next) {
  Day.addday(req.body, function(err, day) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json({success: true,id:day, msg: "Day well added"});
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
