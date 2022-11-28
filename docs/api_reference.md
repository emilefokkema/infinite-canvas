# API Reference

## `InfiniteCanvas` constructor

Creates a new instance of an [`InfiniteCanvas`](#infinitecanvas-class).

```js
var infCanvas = new InfiniteCanvas(canvasEl, config);
```

Parameters:

|name|type|required|
|---|---|---|
|canvasEl|[`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)|yes|
|config|[`InfiniteCanvasConfig`](#infinitecanvasconfig)|no|

## `InfiniteCanvas` class

The class of which an `InfiniteCanvas` is an instance.

### Static properties

Aside from all properties of [`InfiniteCanvasConfig`](#infinitecanvasconfig) (which this class extends), it has the following **static** properties:

|name|type|value|
|---|---|---|
|CANVAS_UNITS|[`InfiniteCanvasUnits`](#infinitecanvasunits)|`CANVAS`|
|CSS_UNITS|[`InfiniteCanvasUnits`](#infinitecanvasunits)|`CSS`|

This makes it easier to refer to these values in this way:

```js
var infCanvas = new InfiniteCanvas(canvasEl, {units: InfiniteCanvas.CSS_UNITS})
```

### Methods

#### `getContext()`

```js
var ctx = infCanvas.getContext();
```

This returns the [`InfiniteCanvasRenderingContext2D`](#infinitecanvasrenderingcontext2d) belonging to this instance.

#### `addEventListener(type, listener, options)`

Adds an event listener to an `InfiniteCanvas`.

Example syntax:

```js
infCanvas.addEventListener('draw', ev => {
    console.log('drawn!')
})
```

Parameters:

|name|type|required|meaning|
|-|-|-|-|
|type|one of the types of [Events](#events)|yes|the type of event that is listened to|
|listener|`Function`|yes|a function that will receive one argument: the event in question, the type of which will depend on `type`|
|options|[`InfiniteCanvasAddEventListenerOptions`](#infinitecanvasaddeventlisteneroptions)|no|options to take into consideration when adding the event listener|

#### `removeEventListener(type, listener)`

Removes an event listener from an `InfiniteCanvas`.

Example syntax:

```js
infCanvas.removeEventListener('draw', myListener)
```

Parameters:

|name|type|required|meaning|
|-|-|-|-|
|type|one of the types of [Events](#events)|yes|the type of event that is being listened to|
|listener|`Function`|yes|the listener to remove|

## InfiniteCanvasAddEventListenerOptions

This interface represents the options to take into consideration when adding an event listener.

### Properties

|name|type|default|effect|
|---|---|---|---|
|once|`boolean`|false|if true, this means that the event listener will be invoked at most once|

## Events

`InfiniteCanvas` exposes the following events:

|type|event type|meaning|
|-|-|-|
|`draw`|[`InfiniteCanvasTransformationEvent`](#infinitecanvastransformationevent)|emitted when the `InfiniteCanvas` has drawn its content on the underlying `<canvas>`|
|`transformationStart`|[`InfiniteCanvasTransformationEvent`](#infinitecanvastransformationevent)|emitted when `InfiniteCanvas` begins transforming (for example when the user begins to pan)|
|`transformationChange`|[`InfiniteCanvasTransformationEvent`](#infinitecanvastransformationevent)|emitted when `InfiniteCanvas` transforms (for example when the user pans)|
|`transformationEnd`|[`InfiniteCanvasTransformationEvent`](#infinitecanvastransformationevent)|emitted when `InfiniteCanvas` has finished transforming|

### InfiniteCanvasTransformationEvent

Properties:

|name|type|meaning|
|-|-|-|
|transformation|[`TransformationRepresentation`](#transformationrepresentation)|the transformation between the `InfiniteCanvas`'s coordinate system and the `<canvas>`'s|
|inverseTransformation|[`TransformationRepresentation`](#transformationrepresentation)|the inverse of `transformation`|

### TransformationRepresentation

A plain object containing number-valued properties `a`, `b`, `c`, `d`, `e` and `f`, which mean the same as the parameters of the same name in [`setTransform()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform).

## InfiniteCanvasConfig

Determines the behavior of the `InfiniteCanvas`.

### Properties

|name|type|default|effect|
|---|---|---|---|
|rotationEnabled|`boolean`|`true`|determines whether rotating the `InfiniteCanvas` is possible or not|
|greedyGestureHandling|`boolean`|`false`|if true, this means that the `InfiniteCanvas` will pan when touched with one finger, and that it will zoom when the user scrolls without pressing the Ctrl key|
|units|[`InfiniteCanvasUnits`](#infinitecanvasunits)|`CANVAS`|determines the units to use when drawing on an `InfiniteCanvas`|

## InfiniteCanvasUnits

An enum. Its values:

- `CSS`: This means that the `InfiniteCanvas` will use a coordinate system whose units correspond to CSS pixels.
- `CANVAS`: This means that the `InfiniteCanvas` will use a coordinate system that corresponds to the underlying `<canvas>`'s `width` and `height` properties.

## InfiniteCanvasRenderingContext2D

This interface inherits all (well...) properties and methods from its parent, [`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

### Methods

It also offers two extra methods:

#### `lineToInfinityInDirection(x, y)`

Just like [`lineTo`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo), this method adds a straight line to the current sub-path, but instead of a line that ends at the point specified by `x` and `y`, it adds a line that starts at the current sub-path's last point and extends to infinity in the *direction* of the vector specified by `x` and `y`.

Parameters:

|name|type|required|meaning|
|-|-|-|-|
|x|`number`|yes|the x component of the vector in the direction of which to add an infinite line|
|y|`number`|yes|the y component of the vector in the direction of which to add an infinite line|

#### `moveToInfinityInDirection(x, y)`

Just like [`moveTo`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo), this method begins a new sub-path, but instead of starting that sub-path at the point specified by `x` and `y`, it starts the sub-path at the "point at infinity" in the direction of the vector specified by `x` and `y`.

Parameters:

|name|type|required|meaning|
|-|-|-|-|
|x|`number`|yes|the x component of the vector in the direction of which to start the sub-path|
|y|`number`|yes|the y component of the vector in the direction of which to start the sub-path|

!> `InfiniteCanvasRenderingContext2D` currently does **not** support [`getImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData), [`createImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData), [`globalAlpha`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha), [`globalCompositeOperation`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation), [`isPointInPath()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath), [`isPointInStroke()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInStroke), [`filter`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter), [`imageSmoothingEnabled`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled), [`imageSmoothingQuality`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality), [`lineJoin`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin), [`miterLimit`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit), [`drawFocusIfNeeded()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded) and [`scrollPathIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scrollPathIntoView).