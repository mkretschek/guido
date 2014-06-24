(function () {
  'use strict';

  var extends = require('./extends');

  exports = module.exports = function (guido) {
    guido.use(extends);
  };
})();
