var express = require('express');
var router = express.Router();
var cors = require('cors');
require('dotenv').config();

var allowedOrigins = [
                      'http://localhost:3000',
                      'http://froala-whiteboard.herokuapp.com/',
                      'https://froala-whiteboard.herokuapp.com/',
                      'http://floopshoop.wpcomstaging.com/contact/',
                      'https://floopshoop.wpcomstaging.com/contact/',
                      'http://floopshoop.wpcomstaging.com/',
                      'https://floopshoop.wpcomstaging.com'
                      ]

var corsOptions = {
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
}

router.all('*', cors(corsOptions))

var FroalaEditor = require('wysiwyg-editor-node-sdk');

var moment = require('moment');
var crypto = require('crypto');

router.get('/', function (req, res, next) {
  var s3Config = {
      bucket: process.env.AWS_S3_BUCKET,
      region: 's3-eu-west-2',
      keyStart: '',
      acl: 'public-read-write',
      accessKeyId: process.env.AWS_ACCESS_KEY
  };

  s3Config.policy = {
      expiration: moment().add(1, 'days').toISOString(),
      conditions: [
          { bucket: s3Config.bucket },
          { acl: s3Config.acl },
          { success_action_status: '201' },
          { 'x-requested-with': 'xhr' },
          [ 'starts-with', '$key', s3Config.keyStart ],
          [ 'starts-with', '$Content-Type', '' ]
      ]
  };
  s3Config.policy = new Buffer.from(JSON.stringify(s3Config.policy)).toString('base64');

  var hash = crypto.createHmac('sha1', process.env.AWS_SECRET_KEY);
  s3Config.signature = new Buffer.from(hash.update(s3Config.policy).digest()).toString('base64');

  res.json(s3Config);
});

module.exports = router;
