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
npm run run:dev
```
which builds `InfiniteCanvas`, puts it in a folder together with a web page and serves the page at `localhost:8080`. The web page contains a list of code snippets that make use of a `CanvasRenderingContext2D` to create drawings. Each code snippet is executed twice: once for a `CanvasRenderingContext2D` as returned by a regular `<canvas>` element, and once for a `CanvasRenderingContext2D` as returned by `InfiniteCanvas`. (Some cases have two code snippets: one that is written for a regular `<canvas>` and one written for an `InfiniteCanvas`.) For each code snippet, the two resulting images are expected to be the same, pixel by pixel. (There are some exceptions where a maximum amount of difference is allowed.) Messages are displayed for each pair of images that fails to meet this expectation.
