
# cqnc

  Simple manager for sequence fx animations or whatever

## Installation

  Install with [component(1)](http://component.io):

    $ component install cristiandouce/Cqnc

  Install with [npm(1)](http://npmjs.org):

    $ npm install cqnc

## Usage

```js
var Cqnc = require('cqnc');

Cqnc()
.add(fillEmail, 'something@cool.com')   // arguments are passed to functions on execution
.add(fillPassword, '123shhh')
.add(fx, from, to, delay)
.cancel(onCqncCancel)
.error(onCqncError)
.run(onCqncEnd)
.stop()                                 // when this invoked, onCqncCancel will be called

// where

function fillEmail(text, done) {}      // should call `done` when finished
function fillPassword(text, done) {}    // same here...
function fx(from, to, delay, done) {}   // ... now you know it

// All sequential functions may return a `cancel` function to be invoked
// when `.stop()` is triggered.

function fillInput (text) {
  var input = document.querySelector('input');
  // fill `input` in some fancy way
  // ...
  // and then ...

  return function cancel() {
    // clear input if Cqnc stopped
    input.value = '';
  }
}

// To stop execution by erroring, just `throw` an `Error` whenever you want
// and `onCqncError` will be called with it

cqnc.add(willError);
cqnc.error(getsCalledOnError);
cqnc.run();

function willError (done) {
  throw new Error('helloooo! I am an Error');
}

```

## API

### Cqnc
Create a `Cqnc` instance with `.add()` and `.run()` functions

```js
var Cqnc = require('Cqnc');
var cqnc = Cqnc(); // or `new Cqnc()`
```

### Cqnc#add(fx [, arg1, arg2, arg3, ...])
Add `fx` to sequence of events, to be called with `arguments.shift()` args

```js
cqnc.add(firstFx);
cqnc.add(fxWithParams, 1, 'abc', ['array', 'too']);
```

### Cqnc#run([end])
Run sequence `steps` 1 by 1 and provide with a `done` function to be called next

```js
cqnc.end(function() {
  // sequence of `fx`s concluded
});
```

### Cqnc#stop()
Cancel execution of events

```js
cqnc.stop();
```

### Cqnc#error(onerror)
Register `onerror` handler

```js
cqnc.error(function onerror (err) {
  err instanceof Error // true
  // log error
});
```

### Cqnc#cancel(oncancel)
Register `oncancel` handler

```js
cqnc.cancel(function oncancel () {
  // called after fx sequence canceled with `.stop()`
});
```

## License

MIT
