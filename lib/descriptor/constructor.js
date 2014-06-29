(function () {
  'use strict';

  var ERROR_MESSAGE = 'Invalid constructor';
  var ERROR_CODE = 'INVALID_CONSTRUCTOR';


  function isValidConstructor(expected, constructor) {
    if (Array.isArray(expected)) {
      var containsConstructor = !!~expected.indexOf(constructor);
      var containsName = !!~expected.indexOf(constructor.name);
      return containsConstructor || containsName;
    }

    return typeof expected === 'string' ?
      expected === constructor.name :
      expected === constructor;
  }


  function constructorDescriptor(expected, val, callback) {
    var constructor = val.constructor;

    if (isValidConstructor(expected, constructor)) {
      callback(null, true);
    } else {
      callback(null, false, {
        message : ERROR_MESSAGE,
        code : ERROR_CODE,
        expected : expected,
        actual : constructor
      });
    }
  }


  exports = module.exports = function (guido) {
    guido.setDescriptor('constructor', constructorDescriptor);
  };
})();
