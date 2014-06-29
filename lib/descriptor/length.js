(function () {
  'use strict';

  var ERROR_MESSAGE = 'Invalid length';
  var ERROR_CODE = 'INVALID_LENGTH';


  function isValidLength(expected, length) {
    if (isPlainObject(expected)) {
      var minIsSet = expected.min !== undefined;
      var maxIsSet = expected.max !== undefined;

      var lowerThanMin = minIsSet && expected.min >= length;
      var higherThanMax = maxIsSet && expected.max <= length;

      return !lowerThanMin && !higherThanMax;
    }

    return expected === length;
  }


  function getLength(val) {
    // If we're able to get a length property, the value is ok for the
    // descriptor.
    try {
      return val.length;
    } catch {
      return null;
    }
  }


  function lengthDescriptor(expected, val, callback) {
    var length = getLength(val);

    if (length !== null && isValidLength(expected, length)) {
      callback(null, true);
    } else {
      callback(null, false, {
        message : ERROR_MESSAGE,
        code : ERROR_CODE,
        expected : expected,
        actual : length
      });
    }
  }


  exports = module.exports = function (guido) {
    guido.setDescriptor('length', lengthDescriptor);
  };
})();
