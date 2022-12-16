[ef-infinite-canvas](api/README.md) / InfiniteCanvas

# Interface: InfiniteCanvas

This interface contains properties that determine the behavior of the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md).

## Hierarchy

- [`Config`](api/interfaces/Config.md)

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

[config.ts:18](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/config.ts#L18)

___

### rotationEnabled

• **rotationEnabled**: `boolean`

Determines whether rotating the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) is possible or not

**`Default Value`**

true

#### Inherited from

[Config](api/interfaces/Config.md).[rotationEnabled](api/interfaces/Config.md#rotationenabled)

#### Defined in

[config.ts:12](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/config.ts#L12)

___

### units

• **units**: [`Units`](api/enums/Units.md)

Determines the units to use when drawing on an [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)

**`Default Value`**

[CANVAS](api/enums/Units.md#canvas)

#### Inherited from

[Config](api/interfaces/Config.md).[units](api/interfaces/Config.md#units)

#### Defined in

[config.ts:24](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/config.ts#L24)

## Methods

### addEventListener

▸ **addEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

Adds an event listener to an [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)

**`Example`**

```js
infCanvas.addEventListener('draw', () => {
    console.log('drawn!')
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`EventMap`](api/interfaces/EventMap.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `K` | The type of event to listen to |
| `listener` | [`EventListener`](api/README.md#eventlistener)<`K`\> | The listener to add |
| `options?` | [`AddEventListenerOptions`](api/interfaces/AddEventListenerOptions.md) | An optional options object |

#### Returns

`void`

#### Defined in

[infinite-canvas.ts:28](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/infinite-canvas.ts#L28)

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

[infinite-canvas.ts:14](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/infinite-canvas.ts#L14)

___

### removeEventListener

▸ **removeEventListener**<`K`\>(`type`, `listener`): `void`

Removes an event listener

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`EventMap`](api/interfaces/EventMap.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `K` | The type of event that the listener to remove is listening to |
| `listener` | [`EventListener`](api/README.md#eventlistener)<`K`\> | The listener to remove |

#### Returns

`void`

#### Defined in

[infinite-canvas.ts:34](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/infinite-canvas.ts#L34)
