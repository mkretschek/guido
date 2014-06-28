(function () {
  'use strict';

  var Checker = require('./checker');

  var guido = new Checker();

  guido.Checker = Checker;
  guido.processors = require('./processor');
  guido.descriptors = require('./descriptors');

  guido.use(guido.processors);
  guido.use(guido.descriptors);

  exports = module.exports = guido;
})();
