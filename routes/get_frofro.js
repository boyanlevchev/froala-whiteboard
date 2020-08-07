var express = require('express');
var router = express.Router();
var cors = require('cors');
require('dotenv').config();

// setting cors below - which websites can access this route

var allowedOrigins = [
    'http://localhost:3000',
    'http://froala-whiteboard.herokuapp.com/',
    'https://froala-whiteboard.herokuapp.com/',
    'http://froala-whiteboard.herokuapp.com/wysiwyg-editor/whiteboard/',
    'https://froala-whiteboard.herokuapp.com/wysiwyg-editor/whiteboard/',
    'http://froala-whiteboard-staging.herokuapp.com/',
    'https://froala-whiteboard-staging.herokuapp.com/',
    'http://froala-whiteboard-staging.herokuapp.com/wysiwyg-editor/whiteboard/',
    'https://froala-whiteboard-staging.herokuapp.com/wysiwyg-editor/whiteboard/',
    'http://froala.com/',
    'https://froala.com/',
    'http://froala.com/wysiwyg-editor/whiteboard/',
    'https://froala.com/wysiwyg-editor/whiteboard/'
  ];

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

// a get request to this route returns the key necessary for using the Froala editor
router.get('/', function(req, res, next) {
  res.send(process.env.FROALA_KEY)
  // res.send('respond with a resource');
});

module.exports = router;
