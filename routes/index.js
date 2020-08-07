var express = require('express');
var router = express.Router();

// a useless route, used for testing
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
