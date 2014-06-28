(function () {
  'use strict';

  var type = require('./type');

  exports = module.exports = function (guido) {
    // TODO(mkretschek): add default descriptors as we implement them

    guido.use(type);
  };
})();
