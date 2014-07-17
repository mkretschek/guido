(function () {
  'use strict';

  exports = module.exports = function (guido) {
    // TODO(mkretschek): add default descriptors as we implement them

    guido.use(require('./accept'));
    guido.use(require('./constructor'));
    guido.use(require('./length'));
    guido.use(require('./type'));
  };
})();
