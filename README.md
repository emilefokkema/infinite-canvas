# InfiniteCanvas

[![npm version](https://badge.fury.io/js/ef-infinite-canvas.svg)](https://badge.fury.io/js/ef-infinite-canvas)

[project page](https://infinite-canvas.org)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/emilefokkema/infinite-canvas.git)

## About

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
<script src="https://cdn.jsdelivr.net/npm/ef-infinite-canvas@0.6.1/dist/infinite-canvas.js"></script>
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
The other level of testing happens by (first running `npm run build` and then) running
```
npm run test-e2e
```
which will start a server that serves pages in which `InfiniteCanvas` is used, and which will then run `jest` tests that use [Puppeteer](https://pptr.dev/) to manipulate those pages and [`jest-image-snapshot`](https://github.com/americanexpress/jest-image-snapshot#readme) to compare screenshots.

*Even though not much has happened in this repository lately, I have not forgotten about it. Quite to the contrary, there are a lot more features I'm planning to add in the not-too-distant future.*
