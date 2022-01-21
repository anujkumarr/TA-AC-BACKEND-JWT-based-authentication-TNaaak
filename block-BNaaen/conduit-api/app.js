// Requiring  packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

require('dotenv').config();

// Requiring the routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
var profilesRouter = require('./routes/profiles');
var tagsRouter = require('./routes/tags');
var userRouter = require('./routes/user');

// Connecting to database
mongoose.connect(
  'mongodb://localhost/conduit-api',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    console.log('Connected to database: ', error ? false : true);
  }
);

// Instantiating the application
var app = express();

// Using the middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Using the routes
app.use('/api/v1', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/articles', articlesRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/tags', tagsRouter);
app.use('/api/v1/user', userRouter);

// Catch 404 and forward them to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Sending the error
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});

// Exporting the application
module.exports = app;
