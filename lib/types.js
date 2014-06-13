
(function () {
  'use strict';

  var _ = require('underscore');


  function isArrayLike(val) {
    return !!val &&
      // length is a finite, legal number
      isFinite(val.length) &&
      // length is positive
      val.length >= 0 &&
      // length is an integer
      val.length % 1 === 0;
  }


  exports = module.exports = function (checker) {
    checker.addNativeType({
      'array'     : _.isArray,
      'array-like': isArrayLike,
      'boolean'   : _.isBoolean,
      'date'      : _.isDate,
      'element'   : _.isElement,
      'function'  : _.isFunction,
      'number'    : _.isNumber,
      'string'    : _.isString,
      'regexp'    : _.isRegExp,
      'null'      : _.isNull
    });
  };

})();
