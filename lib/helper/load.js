(function () {
  'use strict';

  var _ = require('underscore');
  var glob = require('glob');
  var async = require('async');

  var deepExtend = require('./deep-extend');
  var noop = require('./noop');


  function getFilenames(path, callback) {
    if (typeof path !== 'string' && path.length) {
      path = _.flatten(path);

      var tasks = _.map(path, function (p) {
        return function (done) {
          getFilenames(p, function (err, r) {
            done(err, r);
          });
        };
      });

      async.series(tasks, function (err, filenames) {
        callback(err, _.flatten(filenames));
      });

      return;
    }

    if (typeof path === 'string') {
      glob(path, callback);
      return;
    }

    callback(null, []);
  }


  function load(path) {
    var callback = arguments[arguments.length - 1];

    if (typeof callback === 'function') {
      path = Array.prototype.slice.call(arguments, 0, -1);
    } else {
      callback = noop;
      path = Array.prototype.slice.call(arguments, 0);
    }

    getFilenames(path, function (err, filenames) {
      if (err) { return callback(err, null); }

      var formats = {};
      var len, i;

      for (i = 0, len = filenames.length; i < len; i += 1) {
        deepExtend(formats, require(filenames[i]));
      }

      callback(null, formats);
    });
  }


  exports = module.exports = load;
})();
