ef-infinite-canvas

# ef-infinite-canvas

## Enumerations

- [Units](api/enums/Units.md)

## Interfaces

- [AddEventListenerOptions](api/interfaces/AddEventListenerOptions.md)
- [Config](api/interfaces/Config.md)
- [DrawEvent](api/interfaces/DrawEvent.md)
- [EventMap](api/interfaces/EventMap.md)
- [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)
- [InfiniteCanvasCtr](api/interfaces/InfiniteCanvasCtr.md)
- [InfiniteCanvasRenderingContext2D](api/interfaces/InfiniteCanvasRenderingContext2D.md)
- [TransformationEvent](api/interfaces/TransformationEvent.md)
- [TransformationRepresentation](api/interfaces/TransformationRepresentation.md)
- [Transformed](api/interfaces/Transformed.md)

## Type Aliases

### EventListener

Ƭ **EventListener**<`K`\>: (`ev`: [`EventMap`](api/interfaces/EventMap.md)[`K`]) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof [`EventMap`](api/interfaces/EventMap.md) |

#### Type declaration

▸ (`ev`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `ev` | [`EventMap`](api/interfaces/EventMap.md)[`K`] |

##### Returns

`void`

#### Defined in

[event-listener.ts:4](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/event-listener.ts#L4)

## Variables

### default

• **default**: [`InfiniteCanvasCtr`](api/interfaces/InfiniteCanvasCtr.md)

#### Defined in

[infinite-canvas.ts:56](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/infinite-canvas.ts#L56)
