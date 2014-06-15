
(function () {
  'use strict';

  var nativeTypes = require('./types');
  var defaultOperators = require('./operators');

  var load = require('./helper/load');
  var simplify = require('./helper/simplify');


  function Checker() {
    if (!(this instanceof Checker)) {
      return new Checker();
    }

    this.use(defaultOperators);
    this.use(nativeTypes);

    this._native = {};
    this._operators = {};
    this._descriptors = {};
  }


  Checker.prototype = {
    use : function (fn) {
      if (typeof fn === 'function') {
        fn.call(this, this);
      }
    },

    addNativeType : function (type, fn) {
      var key;

      if (typeof type === 'object') {
        for (key in type) {
          if (type.hasOwnProperty(key)) {
            this.addNativeType(key, type[key]);
          }
        }
        return;
      }

      this._native[type] = fn;
    },

    
    addOperator : function (name, fn) {
      var key;

      if (typeof name === 'object') {
        for (key in name) {
          if (name.hasOwnProperty(key)) {
            this.addOperator(name, name[key]);
          }
        }
        return;
      }

      this._operators[name] = fn;
    },


    getType : function (type) {
      return this._native[type] || null;
    },


    getOperator : function (name) {
      return this._operators[name] || null;
    },


    load : function (path) {
      if (arguments.length > 1) {
        path = Array.prototype.slice.call(arguments, 0);
      }

      var descriptors = simplify(load(path), Object.keys(this._native));
      _.extend(this._descriptors, descriptors);

      return this._descriptors;
    },
  };


  var guido = new Checker();
  exports = module.exports = guido;

  guido.Checker = Checker;
  guido.nativeTypes = nativeTypes;
  guido.defaultOperators = defaultOperators;

})();
