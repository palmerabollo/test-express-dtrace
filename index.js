var express = require('express');
var app = express();

app.configure(function () {
  app.use(express.responseTime());
  app.use(express.logger());

  app.use(app.router);

  app.use(express.errorHandler())
});

app.get('/', function home(req, res, next) {
  res.send('hello world');
});

var server = app.listen(4000, function onstart() {
  console.log('Ready');
});
