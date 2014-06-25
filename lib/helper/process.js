(function () {
  'use strict';

  var _ = require('underscore');
  var async = require('async');


  exports = module.exports = function (guido, description, callback) {
    var processors = guido.getProcessor();

    var tasks = _.map(processors, function (fn) {
      return function (done) {
        fn.call(guido, guido, description, function (err, result) {
          if (err) { return done(err); }

          description = result;
          done();
        });
      };
    });

    async.series(tasks, function (err) {
      if (err) { return callback(err, null); }
      callback(null, description);
    });
  };
})();
