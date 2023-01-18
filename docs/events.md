# Events

`InfiniteCanvas` exposes events in roughly the same way that an HTML element does. This means that you can add and remove event listeners using the same [`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method that is present on regular HTML elements.

## Mouse events

One particularity about the [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)s that are emitted by `InfiniteCanvas` (i.e. those that are passed to event listeners to `'click'`, `'mouseover'`, `'pointerdown'` etc.) is the fact that some of the properties have values that are different from those on the corresponding `MouseEvents` that are emitted by the `<canvas>` element. For `MouseEvents` emitted by an `InfiniteCanvas`, the values of the [`offsetX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX), [`offsetY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetY), [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX) and [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY) properties are relative to the transformed coordinate system of the `InfiniteCanvas`, and not relative to the coordinate system of the `<canvas>` element. The same is true for the [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width) and [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height) properties of the [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)s and of the [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX) and [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY) properties of the [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent)s.

## Touch events

Every [`Touch`](https://developer.mozilla.org/en-US/docs/Web/API/Touch) object that is present on a [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) that is emitted by `InfiniteCanvas` has two additional properties, [`infiniteCanvasX`](/api/interfaces/InfiniteCanvasTouch?id=infinitecanvasx) and [`infiniteCanvasY`](/api/interfaces/InfiniteCanvasTouch?id=infinitecanvasy), which represent the x and y coordinates, respectively, of the touch in question as seen from the transformed coordinate system of the `InfiniteCanvas`.

## Preventing defaults

When the left mouse button is pressed down while the mouse is over an `InfiniteCanvas`, the `InfiniteCanvas` will emit a `'mousedown'` event. Under normal circumstances, the `InfiniteCanvas` will now begin to pan once the mouse is moved. If, however, an event listener for `'mousedown'` has been added to the `InfiniteCanvas`, and this event listener has called [`preventDefault()`](/api/interfaces/InfiniteCanvasEventWithDefaultBehavior?id=preventdefault) on the `MouseEvent` that was emitted, panning will be cancelled. The same is true for the `'pointerdown'` event that is also emitted in this case: calling `preventDefault()` on that one will also cancel panning.

The same applies
- with respect to rotating and the `'mousedown'` and `'pointerdown'` events for the second mouse button,
- with respect to zooming and the `'wheel'` event and
- with respect to all transformations and the `'touchstart'` event.

In all these cases, calling `preventDefault()` with `true` as first and only argument will also call `preventDefault()` on the corresponding event that was emitted by the `<canvas>` element.