(function () {
  'use strict';

  var _ = require('underscore');
  var async = require('async');


  exports = module.exports = function (guido, name) {
    var description = guido.getDescription(name);
    var descriptors = [];

    var descriptor;
    var key;

    for (key in description) {
      if (description.hasOwnProperty(key)) {
        descriptor = guido.getDescriptor(key);

        if (!descriptor) {
          continue;
        }

        descriptors.push(descriptor.bind(guido, description[key]));
      }
    }

    // Runs a value against all bound descriptors;
    return function (val, callback) {
      var tasks = _.map(descriptors, function (descriptor) {
        return function (done) {
          descriptor(val, function (err, valid, details) {
            if (err) {
              return done(err);
            }

            if (valid) {
              return done(null);
            }

            done(null, details);
          });
        };
      });

      async.series(tasks, function (err, details) {
        if (err && !err.stopValidation) {
          return callback(err, null);
        }

        if (details && details.length) {
          return callback(null, false, details);
        }

        callback(null, true, null);
      });
    };
  };
})();
