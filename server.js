var express = require('express');
var app = express();
var db = require('./models');
var Cards = db.Cards;
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(__dirname + '/public'));

app.route('/cards')
  .get(function(req, res) {
    Cards.findAll().then(function(cards) {
      res.json(cards);
    });
  })
  .post(function(req, res) {
    Cards.create({title: req.body.title,
                  createdBy:req.body.createdBy, assignedBy:req.body.createdBy,
                  status: "Queue", priority: req.body.priority})
    .then(function (argument) {
      res.json(argument);
    });
  })
  .put(function(req, res) {
    res.send('Update the book');
  })


var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  db.sequelize.sync();
  console.log('listening on',host, port);
});