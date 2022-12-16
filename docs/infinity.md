# Infinity

Paths on `InfiniteCanvas` can extend into infinity.

On a usual `<canvas>`, it is possible to add a line to the current sub-path by using the method [`lineTo(x, y)`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo), which adds a line that goes from the end point of the current sub-path to the point with coordinates `x` and `y`. But on an `InfiniteCanvas`, you have at your disposal the method [`lineToInfinityInDirection(x, y)`](/api/interfaces/InfiniteCanvasRenderingContext2D?id=linetoinfinityindirection), which adds a line that starts at the end point of the current sub-path and goes to infinity in the direction of `x` and `y`.

## Path to infinity

An example: we draw line beginning at (30, 30) and extending to infinity in the direction of (1, 1), which is bottom-right.

### Javascript

```js
ctx.beginPath();
ctx.moveTo(30, 30);
ctx.lineToInfinityInDirection(1, 1);
ctx.stroke();
```

### Result

<infinite-canvas-embed projectid="use-cases/line-to-infinity" :height="300" ></infinite-canvas-embed>

## From infinity to infinity

But you can also add a line that goes from one 'point at infinity' to another. This line will not be visible, because both its starting point and its end point are at infinity.

We begin a path at (60, 60), add a line to infinity in the direction of (1, 1), and then add another line at infinity, towards the direction (-1, 1), which is bottom-left. Then we fill the path, allowing us to see the effect of the last line.

### Javascript

```js
ctx.fillStyle = '#DD4A68';
ctx.beginPath();
ctx.moveTo(60, 60);
ctx.lineToInfinityInDirection(1, 1);
ctx.lineToInfinityInDirection(-1, 1);
ctx.fill();
ctx.stroke();
```

### Result

<infinite-canvas-embed projectid="use-cases/line-to-infinity2" :height="300"></infinite-canvas-embed>

## Starting at infinity

But you can also start a path at infinity, using the method [`moveToInfinityInDirection(x, y)`](/api/interfaces/InfiniteCanvasRenderingContext2D?id=movetoinfinityindirection).

We start a path at infinity in the bottom-right direction, we add a line to the point (60, 60), then we add a line back to infinity in the bottom-left direction and we end by adding a line to (80, 120). Then we fill and stroke the path.

### Javascript

```js
ctx.fillStyle = '#DD4A68';
ctx.beginPath();
ctx.moveToInfinityInDirection(1, 1);
ctx.lineTo(60, 60);
ctx.lineToInfinityInDirection(-1, 1);
ctx.lineTo(80, 120);
ctx.fill();
ctx.stroke();
```

### Result

<infinite-canvas-embed projectid="use-cases/line-to-infinity3" :height="300"></infinite-canvas-embed>

## Connecting infinities

An interesting situation occurs when a sub-path starts at infinity and its end point is at the 'point at infinity' that is in exactly the opposite direction. In this case, the path cannot be filled. You can see this happening below, when the sloping part of the path becomes parallel to the left part of the path.

<infinite-canvas-embed projectid="use-cases/connecting-infinities" :height="350"></infinite-canvas-embed>

## Rectangles

Contrary to the ordinary `<canvas>`'s [`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D), `InfiniteCanvas`'s [`InfiniteCanvasRenderingContext2D`](/api/interfaces/InfiniteCanvasRenderingContext2D) supports `Infinity` (either positive or negative) as a value for either the `x`, `y`, `width` or `height` parameter in the methods [`strokeRect()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect), [`fillRect()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect) and [`clearRect()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect).

This means that you can clear the entire canvas by calling

```js
ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity)
```

or fill the entire canvas by calling

```js
ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity);
```

!> [`rect(x, y, width, height)`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect) will throw an error if neither `x` nor `y` is finite. This is because this method modifies the current sub-path in such a way that its end point becomes (x, y). This is possible if, for example, `x` equals `Infinity` and `y` equals some finite value, because in that case the sub-path will have its 'end point' at infinity to the right. But it is not possible when both `x` and `y` are infinite, because that combination does not uniquely determine a direction.

### Example

Fill and stroke a rectangle using different values for `x`, `y`, `width` and `height`:

```js
ctx.fillRect(x, y, width, height);
ctx.strokeRect(x, y, width, height);
```

### Result

<infinite-canvas-embed projectid="use-cases/rectangles" :height="350"></infinite-canvas-embed>