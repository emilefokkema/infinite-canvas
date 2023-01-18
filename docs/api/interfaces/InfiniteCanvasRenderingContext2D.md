[ef-infinite-canvas](api/README.md) / InfiniteCanvasRenderingContext2D

# Interface: InfiniteCanvasRenderingContext2D

This interface inherits all properties and methods from [`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

**`Remarks`**

`InfiniteCanvasRenderingContext2D` currently does **not** support [`getImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData), [`createImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData), [`globalAlpha`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha), [`globalCompositeOperation`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation), [`isPointInPath()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath), [`isPointInStroke()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInStroke), [`filter`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter), [`imageSmoothingEnabled`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled), [`imageSmoothingQuality`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality), [`lineJoin`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin), [`miterLimit`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit), [`drawFocusIfNeeded()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded) and [`scrollPathIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scrollPathIntoView)

## Hierarchy

- `CanvasRenderingContext2D`

  ↳ **`InfiniteCanvasRenderingContext2D`**

## Methods

### lineToInfinityInDirection

▸ **lineToInfinityInDirection**(`x`, `y`): `void`

Modifies the current sub-path by adding a ray that starts at the sub-path's last point and extends to infinity in the direction of a given vector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The horizontal component of the vector that indicates the direction of the line |
| `y` | `number` | The vertical component of the vector that indicates the direction of the line |

#### Returns

`void`

#### Defined in

[infinite-canvas-rendering-context-2d.ts:13](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas-rendering-context-2d.ts#L13)

___

### moveToInfinityInDirection

▸ **moveToInfinityInDirection**(`x`, `y`): `void`

Begins a new sub-path at a 'point at infinity' that lies in the direction indicated by a given vector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The horizontal component of the vector that indicates the direction of the 'point at infinity' at which to begin a new sub-path |
| `y` | `number` | The vertical component of the vector that indicates the direction of the 'point at infinity' at which to begin a new sub-path |

#### Returns

`void`

#### Defined in

[infinite-canvas-rendering-context-2d.ts:19](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas-rendering-context-2d.ts#L19)
