
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

require('dotenv').config();

// Requiring the routes
var version1indexRouter = require('./routes/index');
var version1usersRouter = require('./routes/users');
var version1booksRouter = require('./routes/books');
var version1commentsRouter = require('./routes/comments');

// Connecting to database
mongoose.connect(
  'mongodb://localhost/book-store',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
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

// Using the routers
app.use('/api/v1', version1indexRouter);
app.use('/api/v1/users', version1usersRouter);
app.use('/api/v1/books', version1booksRouter);
app.use('/api/v1/comments', version1commentsRouter);

// Catch 404 and forward to error handler
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
