/*jshint esversion: 6 */
const mongoose = require('mongoose');

const username = 'hashbinary',
password = 'hashbinary',
host = 'ds113849.mlab.com',
port = '13849',
db = 'broke';
const url = `mongodb://${username}:${password}@${host}:${port}/${db}`;

const conn = mongoose.createConnection(url);

conn.mongo = mongoose.mongo;

//Error
conn.on('error', function(err){
  console.log('Error connecting to database');
  console.log(err);
});

//Connected
conn.on('connected', function(){
  //console.log('Connected to database')
});

module.exports = conn;