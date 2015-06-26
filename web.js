var express = require('express');
var bodyParser = require('body-parser')
var kue = require('kue');
var massive = require('massive');
var uuid = require('node-uuid');
var logger = require('logfmt');
var path = require('path');
var parseRedisUrl = require('parse-redis-url')().parse;

module.exports = function(options) {
  var app = express();
  var redisConfig = parseRedisUrl(options.redis);
  redisConfig.auth = redisConfig.pass;
  app.set('queue', kue.createQueue({ redis: redisConfig }));
  massive.connect({
    connectionString: options.postgres,
    scripts: path.join(__dirname, 'db') }, onDB);

  return app
    .set('view engine', 'jade')
    .set('view cache', false)
    .set('views', path.join(__dirname, 'views'))
    .use('/public', express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .get('/', getArtList, listArt)
    .get('/art/:uuid.json', getArt, sendArt)
    .get('/art/:uuid', getArt, showArt)
    .post('/image', queueImage);


  // Initialize the db
  function onDB(err, db) {
    if (err) throw err;
    db.schema(onSchema);

    // Load any tables we've created from the schema
    function onSchema(err, res) {
      if (err) throw err;
      db.loadTables(onTables);
    }

    // Store a reference to the db
    function onTables(err) {
      app.set('db', db);
      app.emit('ready');
    }
  }

  // Look up processed art in the db and pass it on
  function getArt(req, res, next) {
    logger.log({ event: 'loading art from db', uuid: req.params.uuid });
    app.get('db').art.findOne({ uuid: req.params.uuid }, function(err, art) {
      res.locals.art = art;
      next(err);
    });
  }

  // Render ASCII art
  function showArt(req, res) {
    logger.log({ event: 'showing ascii' });
    res.render('art');
  }

  // Send ASCII art as data
  function sendArt(req, res) {
    logger.log({ event: 'showing json' });
    return res.send(res.locals.art);
  }

  // Look up recently processed art in the db and pass it on
  function getArtList(req, res, next) {
    app.get('db').art.find({}, { limit: 10, order: 'created_at desc' }, function(err, list) {
      res.locals.list = list;
      next(err);
    });
  }

  // Render a list of art
  function listArt(req, res) {
    logger.log({ event: 'listing images' });
    res.render('list');
  }

  // Add an image url to the queue to be processed by a worker
  function queueImage(req, res) {
    var unique = uuid.v1();
    app.get('queue').create('art', { uuid: unique, url: req.body.url }).save();
    logger.log({ event: 'enqueued image', url: req.body.url })
    res.redirect('/art/' + unique);
  }
};
