[ef-infinite-canvas](api/README.md) / EventMap

# Interface: EventMap

## Properties

### draw

• **draw**: [`DrawEvent`](api/interfaces/DrawEvent.md)

Emitted when the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) has drawn its content on the underlying `<canvas>`

#### Defined in

[event-map.ts:8](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/event-map.ts#L8)

___

### transformationChange

• **transformationChange**: [`TransformationEvent`](api/interfaces/TransformationEvent.md)

Emitted when [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) transforms (for example when the user pans)

#### Defined in

[event-map.ts:16](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/event-map.ts#L16)

___

### transformationEnd

• **transformationEnd**: [`TransformationEvent`](api/interfaces/TransformationEvent.md)

Emitted when [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) has finished transforming

#### Defined in

[event-map.ts:20](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/event-map.ts#L20)

___

### transformationStart

• **transformationStart**: [`TransformationEvent`](api/interfaces/TransformationEvent.md)

Emitted when [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) begins transforming (for example when the user begins to pan)

#### Defined in

[event-map.ts:12](https://github.com/emilefokkema/infinite-canvas/blob/c465771/src/api-surface/event-map.ts#L12)
