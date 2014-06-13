(function () {
  'use strict';

  exports = module.exports = function (val) {
    if (val instanceof Date) {
      // Val is already a date
      return val;
    }

    if (val === 'now') {
      return new Date();
    }

    if (typeof val === 'number' || typeof val === 'string') {
      // Get date from timestamp
      return new Date(val);
    }

    if (typeof val === 'function') {
      return val();
    }

    return null;
  };
})();
