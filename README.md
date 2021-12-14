# InfiniteCanvas

[![npm version](https://badge.fury.io/js/ef-infinite-canvas.svg)](https://badge.fury.io/js/ef-infinite-canvas)

`InfiniteCanvas` wraps an HTML5 `<canvas>` element and allows the user to zoom, pan and rotate the contents of the canvas. Content can be drawn on the canvas using the `CanvasRenderingContext2D` that is returned by `InfiniteCanvas`'s `getContext` method.

```js
var canvasElement = document.getElementById("canvas");
var infiniteCanvas = new InfiniteCanvas(canvasElement);
var context = infiniteCanvas.getContext("2d");
```

`InfiniteCanvas` has no dependencies that are not `devDependencies`.

## Installation

Include `InfiniteCanvas` in your web page:

```html
<script src="https://cdn.jsdelivr.net/npm/ef-infinite-canvas@0.5.0-alpha/dist/infinite-canvas.js"></script>
```

or install it using npm:

```
npm install ef-infinite-canvas
```

## Build
```
npm run build
```

## Test

Testing `InfiniteCanvas` happens on two levels. One level is the `jest` tests that are run using
```
npm run test
```
The other level of testing happens by running
```
npm run dev
```
which will start a server that serves a page on which code snippets are executed against both a regular `canvas` and against an `InfiniteCanvas`. The resulting images are then tested for equality.

*Even though not much has happened in this repository lately, I have not forgotten about it. Quite to the contrary, there are a lot more features I'm planning to add in the not-too-distant future.*
