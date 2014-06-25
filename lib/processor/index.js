(function () {
  'use strict';

  var extend = require('./extend');

  exports = module.exports = function (guido) {
    guido.use(extend);
  };
})();
