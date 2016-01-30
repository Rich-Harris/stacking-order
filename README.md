# stacking-order

Determine which of two nodes appears in front of the other.

## Why?

The [stacking order rules](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) are fairly complex. Determining whether node A will render in front of node B involves much more than comparing the `z-index` of the two nodes – you have to consider their parents, and which of them create new *stacking contexts*, which in turn depends on CSS properties like `opacity`, `transform`, `mix-blend-mode` and various others that you probably hadn't considered.

The tie-breaker, if that doesn't yield a conclusive answer, is the position in the document (with later nodes rendering in front of earlier nodes).

## Installation

```bash
npm install --save stacking-order
```

...or grab a copy from [npmcdn.com/stacking-order](npmcdn.com/stacking-order).

## Usage

```js
var stackingOrder = require( 'stacking-order' );

var a = document.querySelector( '.a' );
var b = document.querySelector( '.b' );

var order = stackingOrder.compare( a, b );
// -> `1` if a is in front of b, `-1` otherwise
```

## Bugs

It's entirely possible that the algorithm used here doesn't exactly match the spec. If you find a bug, please [raise an issue](TK) after reading [CONTRIBUTING.md](CONTRIBUTING.md). Thanks!

## License

MIT

---

made by [@rich_harris](https://twitter.com/rich_harris)
