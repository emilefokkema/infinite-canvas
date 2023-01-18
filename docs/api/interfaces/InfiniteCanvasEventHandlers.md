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

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | [`TransformationEvent`](api/interfaces/TransformationEvent.md) |

##### Returns

`any`

#### Defined in

[infinite-canvas.ts:12](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L12)

___

### ontouchignored

• **ontouchignored**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: `Event`) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | `Event` |

##### Returns

`any`

#### Defined in

[infinite-canvas.ts:14](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L14)

___

### ontransformationchange

• **ontransformationchange**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: [`TransformationEvent`](api/interfaces/TransformationEvent.md)) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | [`TransformationEvent`](api/interfaces/TransformationEvent.md) |

##### Returns

`any`

#### Defined in

[infinite-canvas.ts:10](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L10)

___

### ontransformationend

• **ontransformationend**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: [`TransformationEvent`](api/interfaces/TransformationEvent.md)) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | [`TransformationEvent`](api/interfaces/TransformationEvent.md) |

##### Returns

`any`

#### Defined in

[infinite-canvas.ts:11](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L11)

___

### ontransformationstart

• **ontransformationstart**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: [`TransformationEvent`](api/interfaces/TransformationEvent.md)) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | [`TransformationEvent`](api/interfaces/TransformationEvent.md) |

##### Returns

`any`

#### Defined in

[infinite-canvas.ts:9](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L9)

___

### onwheelignored

• **onwheelignored**: (`this`: [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md), `event`: `Event`) => `any`

#### Type declaration

▸ (`this`, `event`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md) |
| `event` | `Event` |

##### Returns

`any`

#### Defined in

[infinite-canvas.ts:13](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L13)

## Methods

### addEventListener

▸ **addEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

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

[infinite-canvas.ts:15](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L15)

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

[infinite-canvas.ts:16](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L16)

___

### removeEventListener

▸ **removeEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

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

[infinite-canvas.ts:17](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L17)

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

[infinite-canvas.ts:18](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/infinite-canvas.ts#L18)
