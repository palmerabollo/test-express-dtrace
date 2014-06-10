var express = require('express');
var app = express();

app.configure(function () {
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');

  app.use(express.responseTime());
  app.use(express.logger());

  app.use(app.router);

  app.use(express.errorHandler())
});

app.get('/', function home(req, res, next) {
  res.render('index');
});

var server = app.listen(4000, function onstart() {
  console.log('Ready');
});
