var express = require('express');
var router = express.Router();
var User = require('../database/Models/Users.js');


/* GET one user detail by token. */
router.get('/token', function(req, res, next) {
  token.decode(req.headers.authorization.slice(4), function(err, user) {
    console.log(user);
    if (err) {
      console.log(err);
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json(user);
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.getalluser(function(err, users) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json(users);
  });
});

/* GET one user detail. */
router.get('/:id', function(req, res, next) {
  User.getuser(req.params.id, function(err, user) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json(user);
  });
});

/* POST one new user detail. */
router.post('/', function(req, res, next) {
  User.adduser(req.body, function(err, result) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json({success: true,id:result, msg: "User well added"});
  });
});

/* PATCH one new user detail. */
router.patch('/:id', function(req, res, next) {
  User.updateuser(req.params.id,req.body, function(err, result) {
    if (err) {
      return res.status(500).json({success: false, msg: err});
    }
    res.status(200).json({success: true,id:result, msg: "User well updated"});
  });
});

module.exports = router;
