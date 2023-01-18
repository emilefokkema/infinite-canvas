[ef-infinite-canvas](api/README.md) / InfiniteCanvas

# Interface: InfiniteCanvas

This interface contains properties that determine the behavior of the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md).

## Hierarchy

- [`Config`](api/interfaces/Config.md)

- [`InfiniteCanvasEventHandlers`](api/interfaces/InfiniteCanvasEventHandlers.md)

- [`Transformed`](api/interfaces/Transformed.md)

  ↳ **`InfiniteCanvas`**

## Properties

### greedyGestureHandling

• **greedyGestureHandling**: `boolean`

If `true`, this means that the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) will pan when touched with one finger, and that it will zoom when the user scrolls without pressing the Ctrl key

**`Default Value`**

false

#### Inherited from

[Config](api/interfaces/Config.md).[greedyGestureHandling](api/interfaces/Config.md#greedygesturehandling)

#### Defined in

[config.ts:18](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/config.ts#L18)

___

### inverseTransformation

• `Readonly` **inverseTransformation**: [`TransformationRepresentation`](api/interfaces/TransformationRepresentation.md)

The inverse of [transformation](api/interfaces/InfiniteCanvas.md#transformation)

#### Inherited from

[Transformed](api/interfaces/Transformed.md).[inverseTransformation](api/interfaces/Transformed.md#inversetransformation)

#### Defined in

[transformed.ts:11](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/transformed.ts#L11)

___

### ondraw

• **ondraw**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: [`TransformationEvent`](api/interfaces/TransformationEvent.md)) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the [draw](api/interfaces/EventMap.md#draw) event

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | [`TransformationEvent`](api/interfaces/TransformationEvent.md) |

##### Returns

`any`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[ondraw](api/interfaces/InfiniteCanvasEventHandlers.md#ondraw)

#### Defined in

[infinite-canvas.ts:24](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L24)

___

### ontouchignored

• **ontouchignored**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: `Event`) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the [touchignored](api/interfaces/EventMap.md#touchignored) event

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | `Event` |

##### Returns

`any`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[ontouchignored](api/interfaces/InfiniteCanvasEventHandlers.md#ontouchignored)

#### Defined in

[infinite-canvas.ts:32](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L32)

___

### ontransformationchange

• **ontransformationchange**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: [`TransformationEvent`](api/interfaces/TransformationEvent.md)) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the [transformationchange](api/interfaces/EventMap.md#transformationchange) event

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | [`TransformationEvent`](api/interfaces/TransformationEvent.md) |

##### Returns

`any`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[ontransformationchange](api/interfaces/InfiniteCanvasEventHandlers.md#ontransformationchange)

#### Defined in

[infinite-canvas.ts:16](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L16)

___

### ontransformationend

• **ontransformationend**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: [`TransformationEvent`](api/interfaces/TransformationEvent.md)) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the [transformationend](api/interfaces/EventMap.md#transformationend) event

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | [`TransformationEvent`](api/interfaces/TransformationEvent.md) |

##### Returns

`any`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[ontransformationend](api/interfaces/InfiniteCanvasEventHandlers.md#ontransformationend)

#### Defined in

[infinite-canvas.ts:20](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L20)

___

### ontransformationstart

• **ontransformationstart**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: [`TransformationEvent`](api/interfaces/TransformationEvent.md)) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the [transformationstart](api/interfaces/EventMap.md#transformationstart) event

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | [`TransformationEvent`](api/interfaces/TransformationEvent.md) |

##### Returns

`any`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[ontransformationstart](api/interfaces/InfiniteCanvasEventHandlers.md#ontransformationstart)

#### Defined in

[infinite-canvas.ts:12](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L12)

___

### onwheelignored

• **onwheelignored**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: `Event`) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

The [event handler property](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_handler_properties) for the [wheelignored](api/interfaces/EventMap.md#wheelignored) event

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | `Event` |

##### Returns

`any`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[onwheelignored](api/interfaces/InfiniteCanvasEventHandlers.md#onwheelignored)

#### Defined in

[infinite-canvas.ts:28](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L28)

___

### rotationEnabled

• **rotationEnabled**: `boolean`

Determines whether rotating the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) is possible or not

**`Default Value`**

true

#### Inherited from

[Config](api/interfaces/Config.md).[rotationEnabled](api/interfaces/Config.md#rotationenabled)

#### Defined in

[config.ts:12](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/config.ts#L12)

___

### transformation

• `Readonly` **transformation**: [`TransformationRepresentation`](api/interfaces/TransformationRepresentation.md)

The transformation that, when applied to a point `(x, y)` in the CSS-pixel-base coordinate system of the `<canvas>` (which has its origin at the top-left corner of the canvas), returns the corresponding point in the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)'s coordinate system

#### Inherited from

[Transformed](api/interfaces/Transformed.md).[transformation](api/interfaces/Transformed.md#transformation)

#### Defined in

[transformed.ts:7](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/transformed.ts#L7)

___

### units

• **units**: [`Units`](api/enums/Units.md)

Determines the units to use when drawing on an [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)

**`Default Value`**

[CANVAS](api/enums/Units.md#canvas)

#### Inherited from

[Config](api/interfaces/Config.md).[units](api/interfaces/Config.md#units)

#### Defined in

[config.ts:24](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/config.ts#L24)

## Methods

### addEventListener

▸ **addEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

See [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`EventMap`](api/interfaces/EventMap.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `ev`: [`EventMap`](api/interfaces/EventMap.md)[`K`]) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[addEventListener](api/interfaces/InfiniteCanvasEventHandlers.md#addeventlistener)

#### Defined in

[infinite-canvas.ts:36](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L36)

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[addEventListener](api/interfaces/InfiniteCanvasEventHandlers.md#addeventlistener)

#### Defined in

[infinite-canvas.ts:37](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L37)

___

### getContext

▸ **getContext**(`contextType?`): [`InfiniteCanvasRenderingContext2D`](api/interfaces/InfiniteCanvasRenderingContext2D.md)

This methods return the [InfiniteCanvasRenderingContext2D](api/interfaces/InfiniteCanvasRenderingContext2D.md) belonging to this instance of [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contextType?` | ``"2d"`` | for (partial) compatibility with the other [getContext()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext) |

#### Returns

[`InfiniteCanvasRenderingContext2D`](api/interfaces/InfiniteCanvasRenderingContext2D.md)

#### Defined in

[infinite-canvas.ts:51](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L51)

___

### removeEventListener

▸ **removeEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

See [`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`EventMap`](api/interfaces/EventMap.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `ev`: [`EventMap`](api/interfaces/EventMap.md)[`K`]) => `any` |
| `options?` | `boolean` \| `EventListenerOptions` |

#### Returns

`void`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[removeEventListener](api/interfaces/InfiniteCanvasEventHandlers.md#removeeventlistener)

#### Defined in

[infinite-canvas.ts:41](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L41)

▸ **removeEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `EventListenerOptions` |

#### Returns

`void`

#### Inherited from

[InfiniteCanvasEventHandlers](api/interfaces/InfiniteCanvasEventHandlers.md).[removeEventListener](api/interfaces/InfiniteCanvasEventHandlers.md#removeeventlistener)

#### Defined in

[infinite-canvas.ts:42](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L42)
