var express = require('express');
var app = express();
var db = require('./models');
var Cards = db.Cards;
var path = require('path');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(__dirname + '/public'));

app.get('/cards', function(req , res) {
  Cards.findAll().then(function(cards) {
      res.json(cards);
  });
});
var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  db.sequelize.sync();
  console.log('listening on',host, port);
});