
(function () {
  'use strict';

  var nativeTypes = require('./types');
  var defaultOperators = require('./operators');
  var Loader = require('./loader');


  function Checker() {
    if (!(this instanceof Checker)) {
      return new Checker();
    }

    this.use(defaultOperators);
    this.use(nativeTypes);

    this._native = {};
    this._operators = {};
    this._descriptors = {};

    this._loader = new Loader(Object.keys(this._native));
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
        this.load(Array.prototype.slice.call(arguments, 0));
        return;
      }

      var len, i;

      if (Array.isArray(path)) {
        for (i = 0, len = path.length; i < len; i += 1) {
          this.load(path[i]);
        }
        return;
      }

      _.extend(this._descriptors, this._loader.load(path));
    },
  };


  var guido = new Checker();
  exports = module.exports = guido;

  guido.Checker = Checker;
  guido.nativeTypes = nativeTypes;
  guido.defaultOperators = defaultOperators;

})();
