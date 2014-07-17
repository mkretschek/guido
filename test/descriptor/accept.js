(function () {
  'use strict';

  var _ = require('underscore');
  var async = require('async');
  var expect = require('chai').expect;

  var Checker = require('../../lib/checker');
  var accept = require('../../lib/descriptor/accept');


  describe('accept descriptor', function () {
    var guido;

    beforeEach(function () {
      guido = new Checker();
      guido.use(accept);
    });


    it('is accessible', function () {
      expect(accept).to.be.defined;
    });


    it('is a function', function () {
      expect(accept).to.be.a('function');
    });


    it('is "usable"', function () {
      function useAccept() {
        guido.use(accept);
      }

      expect(useAccept).to.not.throw;
    });


    it('sets a descriptor', function () {
      var guido = new Checker();

      expect(guido.getDescriptor('accept')).to.be.undefined;

      guido.use(accept);

      expect(guido.getDescriptor('accept')).to.be.a('function');
    });


    it('sets the "accept" keyword', function () {
      var guido = new Checker();

      expect(guido.usesKeyword('accept')).to.be.false;

      guido.use(accept);

      expect(guido.usesKeyword('accept')).to.be.true;
    });


    it('sets the "except" keyword', function () {
      var guido = new Checker();

      expect(guido.usesKeyword('except')).to.be.false;

      guido.use(accept);

      expect(guido.usesKeyword('except')).to.be.true;
    });


    describe('accept', function () {

      describe('with a string', function () {
        var now = new Date();

        beforeEach(function (done) {
          guido.setDescription('String', {
            accept: 'foobar'
          }, done);
        });

        beforeEach(function (done) {
          guido.setDescription('Number', {
            accept: 123456
          }, done);
        });

        beforeEach(function (done) {
          guido.setDescription('Date', {
            accept: now
          }, done);
        });

        beforeEach(function (done) {
          guido.setDescription('Boolean', {
            accept: true
          }, done);
        });


        it('accepts the given value', function (done) {
          var tests = [
            function (cb) { guido.validate('String', 'foobar', cb); },
            function (cb) { guido.validate('Number', 123456, cb); },
            function (cb) { guido.validate('Date', now, cb); },
            function (cb) { guido.validate('Boolean', true, cb); }
          ];

          async.series(tests, function (err, result) {
            if (err) { return done(err); }

            var allValid = _.all(result, function (item) {
              return item[0];
            });

            expect(allValid, 'All to be valid').to.be.true;
            done();
          });
        });


        it('does a strict comparison', function (done) {
          var otherNow = new Date(now.getTime());

          var tests = [
            // Compares a number with a numeric string
            function (cb) { guido.validate('Number', '123456', cb); },

            // Different date objects representing the same date
            function (cb) { guido.validate('Date', otherNow, cb); },

            // Truthy values with a boolean
            function (cb) { guido.validate('Boolean', 'foo', cb); }
          ];

          async.series(tests, function (err, result) {
            if (err) { return done(err); }

            var allInvalid = _.all(result, function (item) {
              return !item[0];
            });

            expect(allInvalid).to.be.true;
            done();
          });
        });


        it('rejects other values', function (done) {
          var otherDate = new Date(now.getTime() - 1000000);

          var tests = [
            // Other string
            function (cb) { guido.validate('String', 'barbaz', cb); },

            // Other number
            function (cb) { guido.validate('Number', 543232, cb); },

            // Different date objects
            function (cb) { guido.validate('Date', otherDate, cb); },

            // Different boolean values
            function (cb) { guido.validate('Boolean', false, cb); },

            // Different types
            function (cb) { guido.validate('String', {}, cb); }
          ];

          async.series(tests, function (err, result) {
            if (err) { return done(err); }

            var allInvalid = _.all(result, function (item) {
              return !item[0];
            });

            expect(allInvalid).to.be.true;
            done();
          });
        });
      }); // with a string



      describe('with a range object', function () {
        it('includes the min limit value', function (done) {
          var description = {
            accept : {min : 'm'}
          };

          guido.setDescription('AtLeastM', description, function (err) {
            if (err) { return done(err); }

            guido.validate('AtLeastM', 'm', function (err, valid) {
              if (err) { return done(err); }

              expect(valid).to.be.true;
              done();
            });
          });
        });


        it('includes the max limit value', function (done) {
          var description = {
            accept : {max : 'm'}
          };

          guido.setDescription('AtMostM', description, function (err) {
            if (err) { return done(err); }

            guido.validate('AtMostM', 'm', function (err, valid) {
              if (err) { return done(err); }

              expect(valid).to.be.true;
              done();
            });
          });
        });


        it('accepts strings between min and max', function (done) {
          var description = {
            accept : {
              min : 'm',
              max : 'n'
            }
          };

          guido.setDescription('StartsWithM', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // At min limit
              function (cb) { guido.validate('StartsWithM', 'm', cb); },

              // In the middle of the range
              function (cb) { guido.validate('StartsWithM', 'mnopqr', cb); },

              // At max limit
              function (cb) { guido.validate('StartsWithM', 'n', cb); }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isValid = _.all(result, function (r) {
                return r[0];
              });

              expect(isValid).to.be.true;
              done();
            });
          });
        });


        it('accepts numbers between min and max', function (done) {
          var description = {
            accept : {
              min : 3,
              max : 5
            }
          };

          guido.setDescription('Between3And5', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // At min limit
              function (cb) { guido.validate('Between3And5', 3, cb); },

              // In the middle of the range
              function (cb) { guido.validate('Between3And5', 3.4567, cb); },

              // At max limit
              function (cb) { guido.validate('Between3And5', 5, cb); }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isValid = _.all(result, function (r) {
                return r[0];
              });

              expect(isValid).to.be.true;
              done();
            });
          });
        });


        it('accepts dates between min and max', function (done) {
          var now = new Date();

          // -1 hour
          var min = new Date(now.getTime() - 60 * 60 * 1000);

          // +1 hour
          var max = new Date(now.getTime() + 60 * 60 * 1000);

          var description = {
            accept : {
              min : min,
              max : max
            }
          };

          guido.setDescription('Within1Hour', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // At min limit
              function (cb) {
                guido.validate('Within1Hour', new Date(min.getTime()), cb);
              },

              // In the middle of the range
              function (cb) {
                var date = new Date(min.getTime() + 1);
                guido.validate('Within1Hour', date, cb);
              },

              function (cb) {
                var date = new Date(max.getTime() - 1);
                guido.validate('Within1Hour', date, cb);
              },

              // At max limit
              function (cb) {
                guido.validate('Within1Hour', new Date(max.getTime()), cb);
              },

              // With timestamps
              function (cb) {
                guido.validate('Within1Hour', min.getTime(), cb);
              },

              function (cb) {
                guido.validate('Within1Hour', max.getTime(), cb);
              },

              function (cb) {
                guido.validate('Within1Hour', min.getTime() + 1, cb);
              },

              function (cb) {
                guido.validate('Within1Hour', max.getTime() - 1, cb);
              },
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isValid = _.all(result, function (r) {
                return r[0];
              });

              expect(isValid).to.be.true;
              done();
            });
          });
        });


        it('works only with min set', function (done) {
          var description = {
            accept : {
              min : 4
            }
          };

          guido.setDescription('Min4', description, function (err) {
            if (err) { return done(err); }

            var tests = {
              'below min' : function (cb) {
                guido.validate('Min4', 3.9999, cb);
              },

              'equal min' : function (cb) {
                guido.validate('Min4', 4, cb);
              },

              'over min' : function (cb) {
                guido.validate('Min4', 4.0001, cb);
              }
            };

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              expect(result['below min'][0], 'below min').to.be.false;
              expect(result['equal min'][0], 'equal min').to.be.true;
              expect(result['over min'][0], 'over min').to.be.true;
              done();
            });
          });
        });


        it('works only with max set', function (done) {
          var description = {
            accept : {
              max : 4
            }
          };

          guido.setDescription('Max4', description, function (err) {
            if (err) { return done(err); }

            var tests = {
              'below max' : function (cb) {
                guido.validate('Max4', 3.9999, cb);
              },

              'equal max' : function (cb) {
                guido.validate('Max4', 4, cb);
              },

              'over max' : function (cb) {
                guido.validate('Max4', 4.0001, cb);
              }
            };

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              expect(result['below max'][0], 'below max').to.be.true;
              expect(result['equal max'][0], 'equal max').to.be.true;
              expect(result['over max'][0], 'over max').to.be.false;
              done();
            });
          });
        });


        it('rejects strings outside the range', function (done) {
          var description = {
            accept : {
              min : 'm',
              max : 'n'
            }
          };

          guido.setDescription('StartsWithM', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // Below min
              function (cb) {
                guido.validate('StartsWithM', 'lzzzzz', cb);
              },

              // Over max
              function (cb) {
                guido.validate('StartsWithM', 'n0', cb);
              }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isInvalid = _.all(result, function (r) {
                return !r[0];
              });

              expect(isInvalid).to.be.true;
              done();
            });
          });
        });


        it('rejects numbers outside the range', function (done) {
          var description = {
            accept : {
              min : 4,
              max : 5
            }
          };

          guido.setDescription('Between4And5', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // Below min
              function (cb) {
                guido.validate('Between4And5', 3.9999, cb);
              },

              // Over max
              function (cb) {
                guido.validate('Between4And5', 5.0001, cb);
              }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isInvalid = _.all(result, function (r) {
                return !r[0];
              });

              expect(isInvalid).to.be.true;
              done();
            });
          });
        });


        it('rejects dates outside the range', function (done) {
          var now = new Date();
          var min = new Date(now.getTime() - 60 * 60 * 1000);
          var max = new Date(now.getTime() + 60 * 60 * 1000);

          var description = {
            accept : {
              min : min,
              max : max
            }
          };

          guido.setDescription('Within1Hour', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // Below min as date
              function (cb) {
                var date = new Date(min.getTime() - 1);
                guido.validate('Within1Hour', date, cb);
              },

              // Below min as timestamp
              function (cb) {
                var timestamp = min.getTime() - 1;
                guido.validate('Within1Hour', timestamp, cb);
              },

              // Over max as date
              function (cb) {
                var date = new Date(max.getTime() + 1);
                guido.validate('Within1Hour', date, cb);
              },

              // Over max as timestamp
              function (cb) {
                var timestamp = max.getTime() + 1;
                guido.validate('Within1Hour', timestamp, cb);
              }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isInvalid = _.all(result, function (r) {
                return !r[0];
              });

              expect(isInvalid).to.be.true;
              done();
            });
          });
        });
      }); // with a range object


      describe('with an array', function () {
        it('accepts the value if it matches any item in the array',
          function (done) {
            var now = new Date();

            var description = {
              accept : [
                'foo',
                123,
                now
              ]
            };

            guido.setDescription('WeirdValue', description, function (err) {
              if (err) { return done(err); }

              var tests = [
                function (cb) { guido.validate('WeirdValue', 'foo', cb); },
                function (cb) { guido.validate('WeirdValue', 123, cb); },
                function (cb) { guido.validate('WeirdValue', now, cb); }
              ];

              async.series(tests, function (err, result) {
                if (err) { return done(err); }

                var isValid = _.all(result, function (r) {
                  return r[0];
                });

                expect(isValid).to.be.true;
                done();
              });
            });

          });


        it('checks against range objects in the array', function (done) {
          var description = {
            accept : [
              {min : 'g', max : 'h'},
              {min : 'i', max : 'j'}
            ]
          };

          guido.setDescription('StartsWithIOrG', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              function (cb) {
                guido.validate('StartsWithIOrG', 'i', cb);
              },

              function (cb) {
                guido.validate('StartsWithIOrG', 'irene', cb);
              },

              function (cb) {
                guido.validate('StartsWithIOrG', 'g', cb);
              },

              function (cb) {
                guido.validate('StartsWithIOrG', 'guido', cb);
              }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isValid = _.all(result, function (r) {
                return r[0];
              });

              expect(isValid).to.be.true;
              done();
            });
          });
        });


        it('rejects values that don\'t match any of the items',
          function (done) {
            var description = {
              accept : [
                'foo',
                {min : 'm', max : 'n'}
              ]
            };

            guido.setDescription('FooOrM', description, function (err) {
              if (err) { return done(err); }

              var tests = [
                function (cb) {
                  guido.validate('FooOrM', 'bar', cb);
                },

                function (cb) {
                  guido.validate('FooOrM', 'lzzzzz', cb);
                },

                function (cb) {
                  guido.validate('FooOrM', 'n0', cb);
                },

                function (cb) {
                  guido.validate('FooOrM', 'fooo', cb);
                }
              ];

              async.series(tests, function (err, result) {
                if (err) { return done(err); }

                var isInvalid = _.all(result, function (r) {
                  return !r[0];
                });

                expect(isInvalid).to.be.true;
                done();
              });
            });
          });
      }); // with an array
    }); // accept


    /************************************************************
     * 'except' descriptor tests
     ***********************************************************/
    describe('except', function () {

      describe('with a string', function () {
        var now = new Date();

        beforeEach(function (done) {
          guido.setDescription('String', {
            except: 'foobar'
          }, done);
        });

        beforeEach(function (done) {
          guido.setDescription('Number', {
            except: 123456
          }, done);
        });

        beforeEach(function (done) {
          guido.setDescription('Date', {
            except: now
          }, done);
        });

        beforeEach(function (done) {
          guido.setDescription('Boolean', {
            except: true
          }, done);
        });


        it('rejects the given value', function (done) {
          var tests = [
            function (cb) { guido.validate('String', 'foobar', cb); },
            function (cb) { guido.validate('Number', 123456, cb); },
            function (cb) { guido.validate('Date', now, cb); },
            function (cb) { guido.validate('Boolean', true, cb); }
          ];

          async.series(tests, function (err, result) {
            if (err) { return done(err); }

            var allInvalid = _.all(result, function (r) {
              return !r[0];
            });

            expect(allInvalid, 'All to be invalid').to.be.true;
            done();
          });
        });


        it('does a strict comparison', function (done) {
          var otherNow = new Date(now.getTime());

          var tests = [
            // Compares a number with a numeric string
            function (cb) { guido.validate('Number', '123456', cb); },

            // Different date objects representing the same date
            function (cb) { guido.validate('Date', otherNow, cb); },

            // Truthy values with a boolean
            function (cb) { guido.validate('Boolean', 'foo', cb); }
          ];

          async.series(tests, function (err, result) {
            if (err) { return done(err); }

            var allValid = _.all(result, function (item) {
              return item[0];
            });

            expect(allValid).to.be.true;
            done();
          });
        });


        it('accepts other values', function (done) {
          var otherDate = new Date(now.getTime() - 1000000);

          var tests = [
            // Other string
            function (cb) { guido.validate('String', 'barbaz', cb); },

            // Other number
            function (cb) { guido.validate('Number', 543232, cb); },

            // Different date objects
            function (cb) { guido.validate('Date', otherDate, cb); },

            // Different boolean values
            function (cb) { guido.validate('Boolean', false, cb); },

            // Different types
            function (cb) { guido.validate('String', {}, cb); }
          ];

          async.series(tests, function (err, result) {
            if (err) { return done(err); }

            var allValid = _.all(result, function (item) {
              return item[0];
            });

            expect(allValid).to.be.true;
            done();
          });
        });
      }); // with a string



      describe('with a range object', function () {
        it('includes the min limit value', function (done) {
          var description = {
            except: {min : 'm'}
          };

          guido.setDescription('AtMostM', description, function (err) {
            if (err) { return done(err); }

            guido.validate('AtMostM', 'm', function (err, valid) {
              if (err) { return done(err); }

              expect(valid).to.be.false;
              done();
            });
          });
        });


        it('includes the max limit value', function (done) {
          var description = {
            except: {max : 'm'}
          };

          guido.setDescription('AtLeastM', description, function (err) {
            if (err) { return done(err); }

            guido.validate('AtLeastM', 'm', function (err, valid) {
              if (err) { return done(err); }

              expect(valid).to.be.false;
              done();
            });
          });
        });


        it('rejects strings between min and max', function (done) {
          var description = {
            except : {
              min : 'm',
              max : 'n'
            }
          };

          guido.setDescription('NotStartsWithM', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // At min limit
              function (cb) { guido.validate('NotStartsWithM', 'm', cb); },

              // In the middle of the range
              function (cb) { guido.validate('NotStartsWithM', 'mnopqr', cb); },

              // At max limit
              function (cb) { guido.validate('NotStartsWithM', 'n', cb); }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isInvalid = _.all(result, function (r) {
                return !r[0];
              });

              expect(isInvalid).to.be.true;
              done();
            });
          });
        });


        it('rejects numbers between min and max', function (done) {
          var description = {
            except : {
              min : 3,
              max : 5
            }
          };

          guido.setDescription('NotBetween3And5', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // At min limit
              function (cb) { guido.validate('NotBetween3And5', 3, cb); },

              // In the middle of the range
              function (cb) { guido.validate('NotBetween3And5', 3.4567, cb); },

              // At max limit
              function (cb) { guido.validate('NotBetween3And5', 5, cb); }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isInvalid = _.all(result, function (r) {
                return !r[0];
              });

              expect(isInvalid).to.be.true;
              done();
            });
          });
        });


        it('rejects dates between min and max', function (done) {
          var now = new Date();

          // -1 hour
          var min = new Date(now.getTime() - 60 * 60 * 1000);

          // +1 hour
          var max = new Date(now.getTime() + 60 * 60 * 1000);

          var description = {
            except : {
              min : min,
              max : max
            }
          };

          guido.setDescription('NotWithin1Hour', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // At min limit
              function (cb) {
                guido.validate('NotWithin1Hour', new Date(min.getTime()), cb);
              },

              // In the middle of the range
              function (cb) {
                var date = new Date(min.getTime() + 1);
                guido.validate('NotWithin1Hour', date, cb);
              },

              function (cb) {
                var date = new Date(max.getTime() - 1);
                guido.validate('NotWithin1Hour', date, cb);
              },

              // At max limit
              function (cb) {
                guido.validate('NotWithin1Hour', new Date(max.getTime()), cb);
              },

              // With timestamps
              function (cb) {
                guido.validate('NotWithin1Hour', min.getTime(), cb);
              },

              function (cb) {
                guido.validate('NotWithin1Hour', max.getTime(), cb);
              },

              function (cb) {
                guido.validate('NotWithin1Hour', min.getTime() + 1, cb);
              },

              function (cb) {
                guido.validate('NotWithin1Hour', max.getTime() - 1, cb);
              },
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isInvalid = _.all(result, function (r) {
                return !r[0];
              });

              expect(isInvalid).to.be.true;
              done();
            });
          });
        });


        it('works only with min set', function (done) {
          var description = {
            except : {
              min : 4
            }
          };

          guido.setDescription('LowerThan4', description, function (err) {
            if (err) { return done(err); }

            var tests = {
              'below min' : function (cb) {
                guido.validate('LowerThan4', 3.9999, cb);
              },

              'equal min' : function (cb) {
                guido.validate('LowerThan4', 4, cb);
              },

              'over min' : function (cb) {
                guido.validate('LowerThan4', 4.0001, cb);
              }
            };

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              expect(result['below min'][0], 'below min').to.be.true;
              expect(result['equal min'][0], 'equal min').to.be.false;
              expect(result['over min'][0], 'over min').to.be.false;
              done();
            });
          });
        });


        it('works only with max set', function (done) {
          var description = {
            except : {
              max : 4
            }
          };

          guido.setDescription('GreaterThan4', description, function (err) {
            if (err) { return done(err); }

            var tests = {
              'below max' : function (cb) {
                guido.validate('GreaterThan4', 3.9999, cb);
              },

              'equal max' : function (cb) {
                guido.validate('GreaterThan4', 4, cb);
              },

              'over max' : function (cb) {
                guido.validate('GreaterThan4', 4.0001, cb);
              }
            };

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              expect(result['below max'][0], 'below max').to.be.false;
              expect(result['equal max'][0], 'equal max').to.be.false;
              expect(result['over max'][0], 'over max').to.be.true;
              done();
            });
          });
        });


        it('accepts strings outside the range', function (done) {
          var description = {
            except : {
              min : 'm',
              max : 'n'
            }
          };

          guido.setDescription('NotStartsWithM', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // Below min
              function (cb) {
                guido.validate('NotStartsWithM', 'lzzzzz', cb);
              },

              // Over max
              function (cb) {
                guido.validate('NotStartsWithM', 'n0', cb);
              }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isValid = _.all(result, function (r) {
                return r[0];
              });

              expect(isValid).to.be.true;
              done();
            });
          });
        });


        it('accepts numbers outside the range', function (done) {
          var description = {
            except : {
              min : 4,
              max : 5
            }
          };

          guido.setDescription('NotBetween4And5', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // Below min
              function (cb) {
                guido.validate('NotBetween4And5', 3.9999, cb);
              },

              // Over max
              function (cb) {
                guido.validate('NotBetween4And5', 5.0001, cb);
              }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isValid = _.all(result, function (r) {
                return r[0];
              });

              expect(isValid).to.be.true;
              done();
            });
          });
        });


        it('accepts dates outside the range', function (done) {
          var now = new Date();
          var min = new Date(now.getTime() - 60 * 60 * 1000);
          var max = new Date(now.getTime() + 60 * 60 * 1000);

          var description = {
            except : {
              min : min,
              max : max
            }
          };

          guido.setDescription('NotWithin1Hour', description, function (err) {
            if (err) { return done(err); }

            var tests = [
              // Below min as date
              function (cb) {
                var date = new Date(min.getTime() - 1);
                guido.validate('NotWithin1Hour', date, cb);
              },

              // Below min as timestamp
              function (cb) {
                var timestamp = min.getTime() - 1;
                guido.validate('NotWithin1Hour', timestamp, cb);
              },

              // Over max as date
              function (cb) {
                var date = new Date(max.getTime() + 1);
                guido.validate('NotWithin1Hour', date, cb);
              },

              // Over max as timestamp
              function (cb) {
                var timestamp = max.getTime() + 1;
                guido.validate('NotWithin1Hour', timestamp, cb);
              }
            ];

            async.series(tests, function (err, result) {
              if (err) { return done(err); }

              var isValid = _.all(result, function (r) {
                return r[0];
              });

              expect(isValid).to.be.true;
              done();
            });
          });
        });
      }); // with a range object


      describe('with an array', function () {
        it('rejects the value if it matches any item in the array',
          function (done) {
            var now = new Date();

            var description = {
              except : [
                'foo',
                123,
                now
              ]
            };

            guido.setDescription('WeirdValue', description, function (err) {
              if (err) { return done(err); }

              var tests = [
                function (cb) { guido.validate('WeirdValue', 'foo', cb); },
                function (cb) { guido.validate('WeirdValue', 123, cb); },
                function (cb) { guido.validate('WeirdValue', now, cb); }
              ];

              async.series(tests, function (err, result) {
                if (err) { return done(err); }

                var isInvalid = _.all(result, function (r) {
                  return !r[0];
                });

                expect(isInvalid).to.be.true;
                done();
              });
            });

          });


        it('checks against range objects in the array', function (done) {
          var description = {
            except : [
              {min : 'g', max : 'h'},
              {min : 'i', max : 'j'}
            ]
          };

          guido.setDescription(
            'NotStartsWithIOrG',
            description,
            function (err) {
              if (err) { return done(err); }

              var tests = [
                function (cb) {
                  guido.validate('NotStartsWithIOrG', 'i', cb);
                },

                function (cb) {
                  guido.validate('NotStartsWithIOrG', 'irene', cb);
                },

                function (cb) {
                  guido.validate('NotStartsWithIOrG', 'g', cb);
                },

                function (cb) {
                  guido.validate('NotStartsWithIOrG', 'guido', cb);
                }
              ];

              async.series(tests, function (err, result) {
                if (err) { return done(err); }

                var isInvalid = _.all(result, function (r) {
                  return !r[0];
                });

                expect(isInvalid).to.be.true;
                done();
              });
            }
          );
        });


        it('accepts values that don\'t match any of the items',
          function (done) {
            var description = {
              except : [
                'foo',
                {min : 'm', max : 'n'}
              ]
            };

            guido.setDescription('NotFooOrM', description, function (err) {
              if (err) { return done(err); }

              var tests = [
                function (cb) {
                  guido.validate('NotFooOrM', 'bar', cb);
                },

                function (cb) {
                  guido.validate('NotFooOrM', 'lzzzzz', cb);
                },

                function (cb) {
                  guido.validate('NotFooOrM', 'n0', cb);
                },

                function (cb) {
                  guido.validate('NotFooOrM', 'fooo', cb);
                }
              ];

              async.series(tests, function (err, result) {
                if (err) { return done(err); }

                var isValid = _.all(result, function (r) {
                  return r[0];
                });

                expect(isValid).to.be.true;
                done();
              });
            });
          });
      }); // with an array
    }); // accept
  });

})();
