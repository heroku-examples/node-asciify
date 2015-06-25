var logger = require('logfmt');
var kue = require('kue');
var ascii = require('image-to-ascii');
var hreq = require('httpreq');
var path = require('path');
var uuid = require('node-uuid');
var massive = require('massive');
var gm = require('gm');
var parseRedisUrl = require('parse-redis-url')().parse;

module.exports = function(options) {
  var redisConfig = parseRedisUrl(options.redis);
  redisConfig.auth = redisConfig.pass;
  var queue = kue.createQueue({ redis: redisConfig });
  massive.connect({
    connectionString: options.postgres,
    scripts: path.join(__dirname, 'db')  }, onDB);

  // Initialize the db
  function onDB(err, db) {
    if (err) throw err;
    db.schema(onSchema);

    // Load any tables we've created from the schema
    function onSchema(err, res) {
      if (err) throw err;
      db.loadTables(onTables);
    }

    // Start processing the queue
    function onTables(err) {
      processQueue(db);
    }
  }

  function processQueue(db) {
    logger.log({ event: 'ready' });
    queue.process('art', onJob);

    function onJob(job, done) {
      var file1 = '/tmp/' + uuid.v1() + path.extname(job.data.url);
      var file2 = '/tmp/' + uuid.v1() + path.extname(job.data.url);
      logger.log({ event: 'processing job', url: job.data.url });

      hreq.download(job.data.url, file1, function() {}, tweak);

      function tweak(err) {
        if (err) throw err;
        gm(file1)
          .contrast(1)
          .resize(null, 2000)
          .write(file2, convert);
      }

      function convert(err) {
        if (err) throw err;
        logger.log({ event: 'converting image to ascii' });
        ascii({
          path: file2,
          colored: false,
          pxWidth: 2,
          pixels: '     ..,:;i1tfL@',
          size: { height: '240%' }
        }, save);
      }

      function save(err, contents) {
        if (err) throw err;
        logger.log({ event: 'saving ascii to db' })
        db.art.save({
          uuid: job.data.uuid,
          url: job.data.url,
          ascii: contents
        }, onSave);

        function onSave(err, record) {
          if (err) throw err;
          logger.log({ event: 'saved art', url: job.data.url });
          done();
        }
      }
    }
  }
};
