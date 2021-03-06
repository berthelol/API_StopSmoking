var express = require('express');
var router = express.Router();
var token = require('../authentication/token');
var Cigarette = require('../database/Models/Cigarettes.js');

/* GET last cigarette listing. */
router.get("/last", function(req, res, next) {
  token.decode(req.headers.authorization.slice(4), function(err, user) {
    Cigarette.getlastcigarette(user,function(err, cigarette) {
      if (err) {
        return res.status(500).json({success: false, msg: err});
      }
      res.status(200).json(cigarette);
    });
  });
});
/* GET cigarettes listing. */
router.get('/', function(req, res, next) {
  token.decode(req.headers.authorization.slice(4), function(err, user) {
    Cigarette.getallcigarettesfromuser(user, function(err, cigarettes) {
      if (err) {
        return res.status(500).json({success: false, msg: err});
      }
      res.status(200).json(cigarettes);
    });
  });
});

/* GET one cigarette listing. */
router.get('/:id', function(req, res, next) {
  Cigarette.getcigarette(req.params.id, function(err, cigarette) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json(cigarette);
  });
});

/*POST new cigarette*/
router.post('/', function(req, res, next) {
  token.decode(req.headers.authorization.slice(4), function(err, user) {
    Cigarette.addcigarette(req.body, user, function(err, cigarette) {
      if (err) {
        return res.status(500).json({success: false, msg: err});
      }
      res.status(200).json({success: true, id: cigarette, msg: "Cigarette well added"});
    });
  });
});

/*Patch update one new cigarette*/
router.patch('/:id', function(req, res, next) {
  Cigarette.updatecigarette(req.params.id, req.body, function(err, result) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json({success: true, id: result, msg: "Cigarette well updated"});
  });
});

/*Delete one cigarette */
router.delete('/:id',function(req,res,next){
  token.decode(req.headers.authorization.slice(4), function(err, user) {
    Cigarette.deleteOneCigarette(req.params.id,user,function(err){
      if(err){
        return res.status(500).json({success: false, msg: err});
      }
      res.status(200).json({success: true, msg: "Cigarette well delete"});
    });
  });
});

module.exports = router;
