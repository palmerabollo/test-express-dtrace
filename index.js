var express = require('express'),
    crypto = require('crypto'),
    logger = require('bunyan').createLogger({name: 'myapp'});

var app = express();

app.configure(function () {
  app.use(express.responseTime());
  app.use(express.urlencoded());

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var bubbles = {}; // in-memory store

app.get('/', function home(req, res) {
  res.redirect('index.html');
});

app.get('/bubbles', function list(req, res) {
    res.json(200, bubbles);
});

app.post('/bubbles', function create(req, res) {
    var uuid = crypto.randomBytes(20).toString('hex');

    var bubble = req.body; // XXX no validation, please be kind
    bubble.uuid = uuid;
    bubble.timestamp = Date.now();

    bubbles[uuid] = bubble;
    res.json(200, bubble);
});

app.get('/bubbles/:id', function detail(req, res) {
    res.json(200, bubbles[req.params.id]);
});

app.delete('/bubbles/:id', function remove(req, res) {
    delete bubbles[req.params.id];
    res.json(204, {});
});

var server = app.listen(4000, function onstart() {
  logger.info('ready');
});

setInterval(function cleanup() {
    logger.debug('run cleanup %d bubbles', Object.keys(bubbles).length);
    for (key in bubbles) {
        var expired = bubbles[key].timestamp < Date.now() - 60000;
        if (expired) {
            logger.debug('clean expired %s', key);
            delete bubbles[key];
        }
    }
}, 30000);
