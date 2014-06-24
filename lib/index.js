
(function () {
  'use strict';

  var _ = require('underscore');

  var defaultDescriptors = require('./descriptor');
  var defaultProcessors = require('./processor');
  var createVerifier = require('./helper/create-verifier');
  var load = require('./helper/load');
  var process = require('./helper/process');


  function Checker() {
    if (!(this instanceof Checker)) {
      return new Checker();
    }

    this._descriptors = {};
    this._descriptions = {};
    this._processors = [];
    this._config = {};

    this.use(defaultDescriptors);
    this.use(defaultProcessors);
  }



  Checker.prototype = {
    
    use : function (fn) {
      if (typeof fn === 'function') {
        fn.call(this, this);
      } else {
        throw(new Error('guido cannot use ' + fn));
      }

      return this;
    },


    config : function (setting, value) {
      if (arguments.length === 1) {
        return this._config[setting];
      }

      this._config[setting] = value;
      return this;
    },


    usesKeyword : function (keyword) {
      return !~this._keywords.indexOf(keyword);
    },


    registerKeyword : function (keyword) {
      if (!this.usesKeyword(keyword)) {
        this._keywords.push(keyword);
      }

      return this;
    },


    addDescriptor : function (name, fn) {
      var key;

      if (typeof name === 'object') {
        for (key in name) {
          if (name.hasOwnProperty(key)) {
            this.addDescriptor(name, name[key]);
          }
        }
        return;
      }

      if (!this.config('silent') && this.usesKeyword(name)) {
        console.warn('Overriding existing keyword:', name);
      }

      this._descriptors[name] = fn;
      this.registerKeyword(name);

      return this;
    },


    addProcessor : function (fn) {
      if (!~this._processors.indexOf(fn)) {
        this._processors.push(fn);
      }

      return this;
    },


    addVerifier : function (name, description) {
      this._verifiers[name] = createVerifier(this, description);
      return this;
    },


    addDescription : function (name, description) {
      if (!isPlainObject(description)) {
        throw(new Error('Description must be an object'));
      }

      var exists = this._descriptions[name];

      if (!exists) {
        this._descriptions[name] = {};
      }

      deepExtend(this._descriptions[name], description);
      this.addVerifier(name, this._descriptions[name]);

      return this;
    },


    load : function (path) {
      if (arguments.length > 1) {
        path = Array.prototype.slice.call(arguments, 0);
      }

      var descriptions = process(load(path), this._processors);

      for (key in descriptions) {
        if (descriptions.hasOwnProperty(key)) {
          this.addDescripton(key, descriptions[key]);
        }
      }

      return this;
    }
  };


  var guido = new Checker();
  exports = module.exports = guido;

  guido.Checker = Checker;
  guido.nativeTypes = nativeTypes;
  guido.defaultOperators = defaultOperators;

})();
