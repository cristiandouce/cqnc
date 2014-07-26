/**
 * Module dependencies.
 */

var assert = require('assert');
var Sequence = require('cqnc');

/**
 * Tests
 */

describe('Sequence', function() {
  it('should create a Sequence instace without `new`', function(done) {
    var cqnc = Sequence();

    assert(cqnc instanceof Sequence);
    done();
  });

  var cqnc = null;

  beforeEach(function(done) {
    cqnc = new Sequence();
    done();
  });

  describe('.add()', function() {
    it('should add fx to cqnc steps', function(done) {
      assert(0 === cqnc.steps.length);

      cqnc.add(dummy1);
      assert(1 === cqnc.steps.length);
      assert.equal(dummy1, cqnc.steps[0].fx);

      cqnc.add(dummy2);
      assert(2 === cqnc.steps.length);
      assert.equal(dummy2, cqnc.steps[1].fx);

      function dummy1() { /* dummy 1 */ }
      function dummy2() { /* dummy 2 */ }

      done();
    });

    it('should save arguments to be called later', function(done) {
      cqnc.add(fx, 'a', 1, [1, 2, '3']);
      function fx() {}

      assert.equal(cqnc.steps[0].args[0], 'a');
      assert.equal(cqnc.steps[0].args[1], 1);
      assert.deepEqual(cqnc.steps[0].args[2], [1, 2, '3']);
      done();
    });
  });

  describe('.run()', function() {
    it('should call each fx in sequence and end with done', function(done) {
      var c = 0;

      cqnc.add(first);
      cqnc.add(second);
      cqnc.add(third);
      cqnc.run(done);

      function first(next) {
        assert(0 === c++);
        next();
      }
      function second(next) {
        assert(1 === c++);
        next();
      }
      function third(next) {
        assert(2 === c);
        next();
      }
    });

    it('should call fx functions with params and next as last', function(done) {
      var c = 0;

      cqnc.add(first, 1);
      cqnc.add(second, '2');
      cqnc.add(third, 1, '2');
      cqnc.run(done);

      function first() {
        assert(2 === arguments.length);
        assert(1 === arguments[0]);
        assert('function' === typeof arguments[1]);
        arguments[1]()
      }
      function second(next) {
        assert(2 === arguments.length);
        assert('2' === arguments[0]);
        assert('function' === typeof arguments[1]);
        arguments[1]()
      }
      function third(next) {
        assert(3 === arguments.length);
        assert(1 === arguments[0]);
        assert('2' === arguments[1]);
        assert('function' === typeof arguments[2]);
        arguments[2]()
      }
    });

    it('should never call done if an error occurs', function(done) {

      try {
        cqnc.add(error);
        cqnc.run(never);
      } catch (err) {
        assert.equal('hello', err.message);
        assert.notEqual('never', err.message);
        done();
      }

      function error(next) {
        throw new Error('hello');
        next();
      }

      function never() {
        throw new Error('never')
      }
    });

  });

  describe('.stop()', function() {
    it('should keep next fx and done from being executed and call cancel', function(done) {

      cqnc.add(stop);
      cqnc.add(never);
      cqnc.run(never);
      cqnc.stop();

      function stop(next) {
        var timeout = setTimeout(next, 500);
        return function cancel() {
          clearTimeout(timeout);
          done();
        };
      }

      function never(next) {
        throw new Error('should necer call')
      }

    });

  });


  describe('.cancel()', function() {
    it('should be called once .stop() cancels execution', function(done) {
      var timeout = 0;
      cqnc.add(stop);
      cqnc.add(never);
      cqnc.cancel(done);
      cqnc.run(never);
      cqnc.stop();

      function stop(next) {
        timeout = setTimeout(next, 500);
        return function cancel() {
          clearTimeout(timeout);
        };
      }

      function never(next) {
        throw new Error('should necer call')
      }
    });

  });


  describe('.error()', function() {
    it('should be called if an error occurs with the Error as argument', function(done) {

      cqnc.add(error);
      cqnc.add(never);
      cqnc.error(onerror);
      cqnc.run(never);
      cqnc.stop();

      function error(next) {
        throw new Error('hello')
      }

      function never(next) {
        throw new Error('should necer call')
      }

      function onerror(err) {
        assert.equal('hello', err.message);
        assert.notEqual('never', err.message);
        done();
      }
    });

  });
});
