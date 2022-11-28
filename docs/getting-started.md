# Getting started

Simply include it in your html

```html
<script src="https://cdn.jsdelivr.net/npm/ef-infinite-canvas@0.5.5-alpha/dist/infinite-canvas.js"></script>
```

or install it using npm:

```
npm install ef-infinite-canvas
```

If you have a `<canvas>` element in your page, simply instantiate an `InfiniteCanvas` like this:

```js
var canvasElement = /* get a reference to your canvas element*/
var infCanvas = new InfiniteCanvas(canvasElement);
```

Now all you need to do is get the [context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D):

```js
var ctx = infCanvas.getContext("2d");
```

Now you can start drawing. [Try the playground!](/playground)