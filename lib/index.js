(function () {
  'use strict';

  var Checker = require('./checker');

  var guido = new Checker();
  exports = module.exports = guido;

  guido.Checker = Checker;
  guido.processors = require('./processor');
  guido.descriptors = require('./descriptors');
})();
