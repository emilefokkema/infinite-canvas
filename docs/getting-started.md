# Getting started

## Installation

Simply run

```cmd
npm install ef-infinite-canvas
```
After this, simply import like this:

```js
import InfiniteCanvas from 'ef-infinite-canvas'
```

Alternatively, add a `<script>` tag to your web page:

```html
<script src="https://cdn.jsdelivr.net/npm/ef-infinite-canvas@0.6.1/dist/infinite-canvas.js" />
```

That script will make a variable named `InfiniteCanvas` globally available.

## Using `InfiniteCanvas`

Once you have a reference to `InfiniteCanvas` and a reference to an existing [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element on the page, you can start [drawing](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) like this:

```js
// assuming there is a <canvas> element that has id 'canvas'
const infCanvas = new InfiniteCanvas(document.getElementById('canvas'))

// get the CanvasRenderingContext2D
const ctx = infCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.lineWidth = 4;
ctx.beginPath();
ctx.rect(30, 30, Infinity, 30);
ctx.fill();
ctx.stroke();

```

Result:

<inf-example example-id="getting-started" />