
const express = require('express');
const db = require('./conf/db');

var app = express();
app.set('view engine', 'jade');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

require('@google-cloud/debug-agent').start();

var index = require('./routes/index');
var user = require('./routes/user');
var order = require('./routes/order');
var lease = require('./routes/lease');
app.use('/', index);
app.use('/user/',user);
app.use('/lease',lease);
app.use('/order', order);


module.exports = app;