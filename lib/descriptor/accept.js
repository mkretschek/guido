(function () {
  'use strict';

  var _ = require('underscore');

  var isPlainObject = require('../helper/is-plain-object');

  var ERROR_MESSAGE = 'Invalid value';
  var ERROR_CODE = 'INVALID_VALUE';


  function isValidValue(expected, val) {
    if (Array.isArray(expected)) {
      return _.any(expected, function (exp) {
        return isValidValue(exp, val);
      });
    } else if (isPlainObject(expected)) {
      var minIsSet = expected.min !== undefined;
      var maxIsSet = expected.max !== undefined;

      var lowerThanMin = minIsSet && expected.min > val;
      var higherThanMax = maxIsSet && expected.max < val;

      return !lowerThanMin && !higherThanMax;
    }

    // TODO(mkretschek): should we do a strict comparison? Should we
    // try to normalize objects (JSON.stringify()?) before comparing?
    return expected === val;
  }



  function valueDescriptor(expected, val, callback) {
    if (isValidValue(expected, val)) {
      callback(null, true);
    } else {
      callback(null, false, {
        message : ERROR_MESSAGE,
        code : ERROR_CODE,
        expected : expected,
        actual : val,
        inverted : false
      });
    }
  }


  function exceptDescriptor(expected, val, callback) {
    valueDescriptor(expected, val, function (err, valid) {
      if (err) {
        return callback(err, null);
      }

      // This descriptor negates the valueDescriptors, therefore, the `valid`
      // parameter passed to the callback is considered invalid in this case.
      if (valid) {
        callback(null, false, {
          message : ERROR_MESSAGE,
          code : ERROR_CODE,
          expected : expected,
          actual : val,
          inverted : true
        });
      } else {
        callback(null, true);
      }
    });
  }


  exports = module.exports = function (guido) {
    guido.setDescriptor('accept', valueDescriptor);
    guido.setDescriptor('except', exceptDescriptor);
  };
})();
