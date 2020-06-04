var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(process.env.FROALA_KEY)
  // res.send('respond with a resource');
});

module.exports = router;
