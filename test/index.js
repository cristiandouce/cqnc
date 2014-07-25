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


  describe('.add()', function() {
    var cqnc = null;

    beforeEach(function(done) {
      cqnc = new Sequence();
      done();
    });

    it('should add fx to cqnc steps', function(done) {
      assert(0 === cqnc.steps.length);
      cqnc.add(function () { /* dummy 1 */ });
      assert(1 === cqnc.steps.length);
      cqnc.add(function () { /* dummy 2 */ });
      assert(2 === cqnc.steps.length);
      done();
    });

    it('should save provided arguments to be called with', function(done) {
      cqnc.add(fx, 'a', 1, [1, 2, '3']);
      function fx() {}

      assert.equal(cqnc.steps[0].args[0], 'a');
      assert.equal(cqnc.steps[0].args[1], 1);
      assert.deepEqual(cqnc.steps[0].args[2], [1, 2, '3']);
      done();
    });
  });
});
