var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var users = require('./routes/users');
var question = require('./routes/question');
//var questions = new question();
var paper = require('./routes/paper');
//paper manager
var score = require('./routes/score_route');
//score manager;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);
//app.use('/question',question);
app.use('/score',score);
//question conduct;

//paper managerment;
app.use('/paper',paper);

//list question
app.get('/question',question.listquestion);
//add question;
app.get('/addquestion',question.addquestion);
//submit question adding
app.post('/addquestion',question.submitadding);
//delete question;
app.post('/question',question.deletequestion);
//modify question;
app.get('/modifyquestion',question.modifyquestion);
//submit modify;
app.post('/modifyquestion',question.submitmodify);

//score manager
//app.get('/score',score.main);
//score index;
//list students index,paper index;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
