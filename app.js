var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signatureRouter = require('./routes/get_signature');
var frofroRouter = require('./routes/get_frofro');


var cors = function(req, res, next) {
  var whitelist = [
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
  var origin = req.headers.origin;
  if (whitelist.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
}

var app = express();

app.use(cors);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/wysiwyg-editor/whiteboard', express.static(path.join(__dirname, './froala-fun/build')))


app.use('/wysiwyg-editor/whiteboard/', indexRouter);
app.use('/wysiwyg-editor/whiteboard/api/users', usersRouter);
app.use('/wysiwyg-editor/whiteboard/api/get_signature', signatureRouter);
app.use('/wysiwyg-editor/whiteboard/api/get_frofro', frofroRouter);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'froala-fun','build','index.html'))
})

// console.log("this is the dirname", __dirname)


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


module.exports = app;
