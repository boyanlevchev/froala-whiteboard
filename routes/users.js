var express = require('express');
var router = express.Router();

// a useless route, used for testing

router.get('/', function(req, res, next) {
  res.json([
    {id:1, username: "peep"},
    {id:2, username: "doop"}
  ])
  // res.send('respond with a resource');
});

module.exports = router;
