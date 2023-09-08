# Guide

This guide explains a number of concepts that are particular to `InfiniteCanvas`. It also mentions some of `InfiniteCanvas`'s limitations.

## Infinity

On a usual &lt;canvas&gt;, a path can only contain finite points, i.e. points with finite `x` and `y` coordinates. On an `InfiniteCanvas`, however, paths can also contain "points" that are _at infinity_. To describe such paths, two methods have been added to the [`InfiniteCanvasRenderingContext2D`](/api/interfaces/InfiniteCanvasRenderingContext2D), namely [`moveToInfinityInDirection(x, y)`](/api/interfaces/InfiniteCanvasRenderingContext2D.html#movetoinfinityindirection) and [`lineToInfinityInDirection(x, y)`](/api/interfaces/InfiniteCanvasRenderingContext2D.html#linetoinfinityindirection).

### Start a path at infinity

On a regular &lt;canvas&gt;, we can start a path at some point by calling [`moveTo(x, y)`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo). If we then call [`lineTo(x2, y2)`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo), we end up with a path that consists of a line segment connecting `(x, y)` and `(x2, y2)`. But on an `InfiniteCanvas`, we can start a path _at infinity_ by calling `moveToInfinityInDirection(x, y)`. Once we have done this, the starting point of our current path is _at infinity_ in the direction indicated by the vector with coordinates `(x, y)`. For example, if we call `moveToInfinityInDirection(1, 0)`, the starting point of our path will be _at infinity_ to the right. If we now call `lineTo(x3, y3)`, we end up with a path that consists of a _ray_ from the point at `(x3, y3)` towards infinity to the right.

```js
ctx.lineWidth = 3;

ctx.strokeStyle = '#0f0';
ctx.beginPath();
ctx.moveTo(150, 50); // starting point of the green path
ctx.lineTo(50, 50); // end point of the green path
ctx.stroke();

ctx.strokeStyle = '#f00'
ctx.beginPath();
ctx.moveToInfinityInDirection(1, 0); // starting "point" of the red path
ctx.lineTo(50, 150); // end point of the red path
ctx.stroke();
```

Result:

<inf-example example-id="start-path-at-infinity" />

### Lines to infinity

On an `InfiniteCanvas`, we can not only start paths _at infinity_, we can also extend our path by adding a line to infinity. We do this by calling `lineToInfinityInDirection(x, y)`. This will add a ray that starts at the point where our path currently is, and that extends to infinity in the direction given by the vector `(x, y)`. Consider this example:

```js
ctx.lineWidth = 3;

ctx.strokeStyle = '#090';
ctx.fillStyle = '#00990044';

ctx.beginPath(); // begin the green path
ctx.moveTo(10, 10);
ctx.lineTo(10, 110);
ctx.lineTo(110, 110);

ctx.fill(); // fill the green path, which has only finite lines
ctx.stroke();

ctx.strokeStyle = '#900';
ctx.fillStyle = '#99000044';

ctx.beginPath(); // begin the red path
ctx.moveTo(10, 140);
ctx.lineTo(10, 240);
ctx.lineToInfinityInDirection(1, 0);

ctx.fill(); // fill the red path, which contains a line to infinity
ctx.stroke();
```

Result:

<inf-example example-id="line-to-infinity" />

Note the filling of the red path: because the starting point of the path is at the top left, and the end "point" of the path is at infinity to the right, the filled area is the result of "connecting" the starting point to the end "point", which means adding another ray, but one that starts at the starting point at the top left and that extends to infinity to where the path starts.

### Infinite rectangles

The methods [`rect(x, y, width, height)`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect), [`fillRect(x, y, width, height)`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect), [`strokeRect(x, y, width, height)`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect) and [`clearRect(x, y, width, height)`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect) of the `InfiniteCanvasRenderingContext2D` accept `Infinity` and `-Infinity` as values for `x`, `y`, `width` and `height`.

Consider this example: 

```js
ctx.fillStyle = '#00009966'; // blue
ctx.fillRect(30, 30, 30, -Infinity) // A rectangle that extends upwards indefinitely

ctx.fillStyle = '#99000066'; // red
ctx.fillRect(60, 60, -Infinity, 30) // A rectangle that extends to the left indefinitely

ctx.fillStyle = '#00990066'; // green
ctx.fillRect(90, 60, Infinity, 30) // A rectangle that extends to the right indefinitely

ctx.fillStyle = '#99990066'; // yellow
ctx.fillRect(30, 120, 30, Infinity) // A rectangle that extends downwards indefinitely

ctx.fillStyle = '#99009966'; // magenta
ctx.fillRect(-Infinity, 150, Infinity, 30) // A rectangle that extends both left and right indefinitely

ctx.fillStyle = '#00999966'; // cyan
ctx.fillRect(120, -Infinity, 30, Infinity) // A rectangle that extends both upwards and downwards indefinitely

```

Result:

<inf-example example-id="infinite-rectangles-1" />

::: warning
Be careful about supplying `Infinity` or `-Infinity` as values for `x` or `y` in the `rect(x, y, width, height)` method. This method is different from the others in that it does not draw anything, but only modifies the current path. In doing so, it will try to ensure that the end point of the current path will end up at the point specified by `x` and `y`. But it can only do that if `x` and `y` together specify either a point (i.e. `x` and `y` are both finite), or if they specify a "point" _at infinity_ (i.e. one of `x` and `y` is finite and the other is not). If neither `x` nor `y` is finite, `rect(x, y, width, height)` will throw an error.
:::

#### Filling or clearing the entire canvas

The entire `InfiniteCanvas` can be filled or cleared by calling `fillRect(-Infinity, -Infinity, Infinity, Infinity)` or `clearRect(-Infinity, -Infinity, Infinity, Infinity)`, respectively.

## Events

`InfiniteCanvas` exposes events in roughly the same way that an HTML element does. This means that you can add and remove event listeners using the same [`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method that is present on regular HTML elements.

### Mouse events

One particularity about the [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)s that are emitted by `InfiniteCanvas` (i.e. those that are passed to event listeners to `'click'`, `'mouseover'`, `'pointerdown'` etc.) is the fact that some of the properties have values that are different from those on the corresponding `MouseEvents` that are emitted by the `<canvas>` element. For `MouseEvents` emitted by an `InfiniteCanvas`, the values of the [`offsetX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX), [`offsetY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetY), [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX) and [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY) properties are relative to the transformed coordinate system of the `InfiniteCanvas`, and not relative to the coordinate system of the `<canvas>` element. The same is true for the [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width) and [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height) properties of the [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)s and of the [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX) and [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY) properties of the [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)s.

### Touch events

Every [`Touch`](https://developer.mozilla.org/en-US/docs/Web/API/Touch) object that is present on a [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) that is emitted by `InfiniteCanvas` has two additional properties, [`infiniteCanvasX`](/api/interfaces/InfiniteCanvasTouch.html#infinitecanvasx) and [`infiniteCanvasY`](/api/interfaces/InfiniteCanvasTouch.html#infinitecanvasy), which represent the x and y coordinates, respectively, of the touch in question as seen from the transformed coordinate system of the `InfiniteCanvas`.

### Preventing defaults

When the left mouse button is pressed down while the mouse is over an `InfiniteCanvas`, the `InfiniteCanvas` will emit a `'mousedown'` event. Under normal circumstances, the `InfiniteCanvas` will now begin to pan once the mouse is moved. If, however, an event listener for `'mousedown'` has been added to the `InfiniteCanvas`, and this event listener has called [`preventDefault()`](/api/interfaces/InfiniteCanvasEventWithDefaultBehavior.html#preventdefault) on the `MouseEvent` that was emitted, panning will be cancelled. The same is true for the `'pointerdown'` event that is also emitted in this case: calling `preventDefault()` on that one will also cancel panning.

The same applies
- with respect to rotating and the `'mousedown'` and `'pointerdown'` events for the second mouse button,
- with respect to zooming and the `'wheel'` event and
- with respect to all transformations and the `'touchstart'` event.

In all these cases, calling `preventDefault()` with `true` as first and only argument will also call `preventDefault()` on the corresponding event that was emitted by the `<canvas>` element.

## Limitations

The one thing that `InfiniteCanvas` does is to add infinity to the 2D surface on which you can draw. But this comes at a cost: every time you pan, zoom or rotate, the drawing has to be redrawn. This means the drawing has to be kept in memory, which also means that replacing the entire drawing with a new drawing takes a little bit more time than if you were simply drawing on a regular &lt;canvas&gt;. In other words: animations are expensive on `InfiniteCanvas`.

::: warning
`InfiniteCanvasRenderingContext2D` currently does **not** support [`getImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData), [`createImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData), [`isPointInPath()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath), [`isPointInStroke()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInStroke), [`drawFocusIfNeeded()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded) and [`scrollPathIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scrollPathIntoView)
:::