var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
const {
  RES_CODE_CLIENT_ERR,
  RES_CODE_UNDEFINED
} = require("./constants/index");


// DB Model initialization
require('./models/db');

// Initializing the API routes
var indexRouter = require('./routes/index');
var recordRouter = require('./routes/record');


var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Binding the modules with related routes
app.use('/', indexRouter);
app.use('/records', recordRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let payloadStatusCode = (err.status == 400 ? RES_CODE_CLIENT_ERR : RES_CODE_UNDEFINED);
  let payloadErrorMessage = ((err.message.includes("Unexpected token") && err.message.includes("JSON")) ? ("The payload sent is invalid") : err.message)
  res.status(err.status || 500);
  res.send({status: payloadStatusCode, msg: payloadErrorMessage});
});

module.exports = app;
