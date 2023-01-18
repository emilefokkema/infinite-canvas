[ef-infinite-canvas](api/README.md) / InfiniteCanvasEventHandlers

# Interface: InfiniteCanvasEventHandlers

## Hierarchy

- `DocumentAndElementEventHandlers`

- `GlobalEventHandlers`

  ↳ **`InfiniteCanvasEventHandlers`**

  ↳↳ [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md)

## Properties

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

#### Defined in

[infinite-canvas.ts:28](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L28)

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

#### Overrides

DocumentAndElementEventHandlers.addEventListener

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

#### Overrides

DocumentAndElementEventHandlers.addEventListener

#### Defined in

[infinite-canvas.ts:37](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L37)

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

#### Overrides

DocumentAndElementEventHandlers.removeEventListener

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

#### Overrides

DocumentAndElementEventHandlers.removeEventListener

#### Defined in

[infinite-canvas.ts:42](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas.ts#L42)
