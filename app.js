var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
// var request = require('request')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signatureRouter = require('./routes/get_signature');
var frofroRouter = require('./routes/get_frofro');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// const path = require('path')// Serve static files from the React frontend app

app.use(express.static(path.join(__dirname, './froala-fun/build')))// Anything that doesn't match the above, send back index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'froala-fun','build','index.html'))
// })

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/get_signature', signatureRouter);
app.use('/api/get_frofro', frofroRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'froala-fun','build','index.html'))
})

// app.route('*').get(function(req, res, next) {

//   req.get('/', function(err, response, body) {
//     if (!err) {
//       // req.send(body);
//       res.sendFile(path.join(__dirname, 'froala-fun','build','index.html'))
//     }
//   });
// });

// app.get('*', function(req, res) {
//     res.redirect('/');
// });

// function redirectUnmatched(req, res) {
//   res.redirect("/");
// }

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var allowedOrigins = ['https://localhost:3000',
                      'https://froala-whiteboard.herokuapp.com',
                      'https://floopshoop.wpcomstaging.com']

app.use(cors({
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
  }
}))

module.exports = app;
