
# cqnc

  Simple manager for sequence fx animations or whatever

## Installation

  Install with [component(1)](http://component.io):

    $ component install cristiandouce/sequence

## Usage

```
var Sequence = require('cqnc');

Sequence()
.add(fillEmail, 'something@cool.com')   // arguments are passed to functions on execution
.add(fillPassword, '123shhh')
.add(fx, from, to, delay)
.cancel(onSequenceCancel)
.error(onSequenceError)
.run(onSequenceEnd)
.stop()                                 // when this invoked, onSequenceCancel will be called

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
    // clear input if sequence stopped
    input.value = '';
  }
}

// To stop execution by erroring, just `throw` an `Error` whenever you want
// and `onSequenceError` will be called with it
function willError (done) {
  throw new Error('helloooo! I am an Error');
}

```

## API

### Sequence

### Sequence#add(fx [, arg1, arg2, arg3, ...])

### Sequence#run([end])

### Sequence#stop()

### Sequence#cancel(oncancel)

### Sequence#error(onerror)


## License

  The MIT License (MIT)

  Copyright (c) 2014 Cristian Douce <me@cristiandouce.com>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
