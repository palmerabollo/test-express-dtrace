var express = require('express'),
    // middlewares as extra dependencies
    responseTime = require('response-time'),
    bodyParser = require('body-parser'),
    crypto = require('crypto'),
    logger = require('bunyan').createLogger({name: 'myapp'});

var app = express();

// no app.configure

app.use(responseTime());
app.use(bodyParser());

app.use(express.static(__dirname + '/public'));

var bubbles = {}; // in-memory store

// normal app.verb still work
// but we can use routers
var router = express.Router();

router.route('/')
    .get(function home(req, res) {
        res.redirect('index.html');
    });

router.route('/bubbles')
    .get(function list(req, res) {
        res.json(200, bubbles);
    })
    .post(function create(req, res) {
        var uuid = crypto.randomBytes(20).toString('hex');

        var bubble = req.body; // XXX no validation, please be kind
        bubble.uuid = uuid;
        bubble.timestamp = Date.now();

        bubbles[uuid] = bubble;
        res.json(200, bubble);
    });

// param triggers
router.param('id', function (req, res, next, id) {
    if (!bubbles[id]) {
        logger.warn('bubble id %s not found', id)
        res.json(404, 'not found');
    } else {
        logger.info('bubble id %d', id);
        next();
    }
})

router.route('/bubbles/:id')
    .get(function detail(req, res) {
        res.json(200, bubbles[req.params.id]);
    })
    .delete(function remove(req, res) {
        delete bubbles[req.params.id];
        res.json(204, {});
    });

app.use('/', router);

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
