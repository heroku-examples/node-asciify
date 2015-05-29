var logger = require('logfmt');
var kue = require('kue');
var ascii = require('image-to-ascii');
var hreq = require('httpreq');
var path = require('path');
var uuid = require('node-uuid');
var massive = require('massive');

module.exports = function(options) {
  var queue = kue.createQueue({ redis: options.redis });
  massive.connect({ connectionString: options.postgres }, onDB);

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
      var filename = '/tmp/' + uuid.v1() + path.extname(job.data.url);
      logger.log({ event: 'processing job', url: job.data.url });

      hreq.download(job.data.url, filename, function() {}, convert);

      function convert(err) {
        if (err) throw err;
        logger.log({ event: 'converting image to ascii' });
        ascii({
          path: filename,
          colored: false,
          size: { height: '200%' }
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
