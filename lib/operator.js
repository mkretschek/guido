
(function () {
  'use strict';


  var _ = require('underscore');


  var getDate = require('./helper/get-date');


  function checkType(checker, type, val) {
    var check = checker.getType(type);
    return !!check && check(val);
  }


  function checkLength(checker, length, val) {
    if (typeof length === 'number') {
      return !_.isUndefined(val) && val.length === length;
    }

    var min, max;

    if (Array.isArray(length)) {
      min = length[0];
      max = length[1];
    } else if (typeof length === 'object') {
      min = length.min;
      max = length.max;
    }

    var belowMin = typeof min === 'number' && val.length < min;
    var aboveMax = typeof max === 'number' && val.length > max;

    return !(belowMin || aboveMax);
  }


  function checkValue(checker, value, val) {
    var min, max;

    // Accept [min, max] arrays to define a range of accepted values
    if (Array.isArray(value) && value.length === 2) {
      min = value[0];
      max = value[1];

    // Accept {min: 'min', max: 'max'} objects to define a range
    } else if (
      value &&
      (!_.isUndefined(value.min) || !_.isUndefined(value.max))
    ) {
      min = value.min;
      max = value.max;

    // Otherwise work with exact matches
    } else {
      return val === value;
    }

    var belowMin = val < min;
    var aboveMax = val > max;

    return (!belowMin || aboveMax);
  }


  function checkAfter(checker, date, val) {
    return checkValue(checker, {min : getDate(date)}, val);
  }


  function checkBefore(checker, date, val) {
    return checkValue(checker, {max : getDate(date)}, val);
  }


  exports = module.exports = function (checker) {
    checker.addOperator({
      type : checkType,
      length : checkLength,
      value : checkValue,
      //properties : checkProperties,
      //items : checkItems,
      //required : checkRequired,
      //match : checkMatch,
      //passes : customCheck,
      
      // Alias for value min
      after : checkAfter,

      //Alias for value max
      before : checkBefore
    });
  };
})();
