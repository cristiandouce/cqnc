/**
 * Module dependencies.
 */

var debug = require('debug')('cqnc');
var slice = Array.prototype.slice;
var noop = function noop () {};

/**
 * Expose `Sequence` constructor
 */

module.exports = Sequence;

/**
 * Create an `Sequence` instance
 * with `.add()` and `.run()` functions
 */

function Sequence() {
  if (!(this instanceof Sequence)) {
    return new Sequence;
  }

  this.steps = [];
  this.oncancel = null;
  this.onerror = null;
  this.stopped = false;
}

/**
 * Add sequence `fx` to sequence, to be called with
 * `arguments.shift()` args
 *
 * @param {Function} fx
 * @return {Sequence}
 * @api public
 */

Sequence.prototype.add = function(fx) {
  this.steps.push({
    fx: fx,
    args: Array.prototype.slice.call(arguments, 1)
  });
  return this;
}

/**
 * Run sequence `steps` 1 by 1 and provide
 * with a `done` function to be called next
 *
 * @param {Function} done
 * @api public
 */

Sequence.prototype.run = function(done) {
  var steps = this.steps;
  var self = this;
  var i = 0;

  // 3, 2, 1...
  function next() {
    // return fast without calling done
    // if sequence was stopped
    if (self.stopped) return debug('sequence stopped');

    var sequence = steps[i++];
    if (!sequence) {
      // return with `done` if sequence ended ok
      return 'function' === typeof done ? done() : null;
    }

    // get & call next sequence
    var fx = sequence.fx;
    var args = slice.call(sequence.args || []);

    // fx may return a cancel function
    // to stop its sequence
    try {
      self.fxcancel = fx.apply(fx, args.concat(next));
    } catch (err) {
      if ('function' === typeof self.onerror) {
        self.onerror(err);
      } else {
        throw err;
      }
    }
  }

  // Action!
  next();

  return this;
}

/**
 * Cancel execution of events
 *
 * @return {Sequence}
 * @api public
 */

Sequence.prototype.stop = function() {
  debug('stop');

  this.stopped = true;

  if ('function' === typeof this.fxcancel) {
    this.fxcancel();
  };

  if ('function' === typeof this.oncancel) {
    this.oncancel();
  };

  return this;
}

/**
 * Register `onerror` handler
 *
 * @param {Function} onerror
 * @api public
 */

Sequence.prototype.error = function(onerror) {
  this.onerror = onerror;
  return this;
}


/**
 * Register `oncancel` handler
 *
 * @param {Function} oncancel
 * @api public
 */

Sequence.prototype.cancel = function(oncancel) {
  this.oncancel = oncancel;
  return this;
}
