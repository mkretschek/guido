(function () {
  'use strict';

  var ERROR_MESSAGE = 'Invalid type';
  var ERROR_CODE = 'INVALID_TYPE';


  function isValidType(expected, type) {
    return Array.isArray(expected) ?
      !!~expected.indexOf(type) :
      type === expected;
  }


  function typeDescriptor(expected, val, callback) {
    var type = typeof val;

    if (isValidType(expected, type)) {
      callback(null, true);
    } else {
      callback(null, false, {
        message : ERROR_MESSAGE,
        code : ERROR_CODE,
        expected : expected,
        actual : type
      });
    }
  }


  exports = module.expors = function (guido) {
    guido.setDescriptor('type', typeDescriptor);
  };
})();
