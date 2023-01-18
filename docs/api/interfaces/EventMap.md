[ef-infinite-canvas](api/README.md) / EventMap

# Interface: EventMap

## Hierarchy

- `HTMLElementEventMap`

  ↳ **`EventMap`**

## Properties

### draw

• **draw**: [`DrawEvent`](api/interfaces/DrawEvent.md)

Emitted when the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) has drawn its content on the underlying `<canvas>`

#### Defined in

[event-map.ts:22](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L22)

___

### mousedown

• **mousedown**: `MouseEvent` & [`InfiniteCanvasEventWithDefaultBehavior`](api/interfaces/InfiniteCanvasEventWithDefaultBehavior.md)

#### Overrides

HTMLElementEventMap.mousedown

#### Defined in

[event-map.ts:25](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L25)

___

### pointerdown

• **pointerdown**: `PointerEvent` & [`InfiniteCanvasEventWithDefaultBehavior`](api/interfaces/InfiniteCanvasEventWithDefaultBehavior.md)

#### Overrides

HTMLElementEventMap.pointerdown

#### Defined in

[event-map.ts:26](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L26)

___

### touchcancel

• **touchcancel**: [`InfiniteCanvasTouchEvent`](api/interfaces/InfiniteCanvasTouchEvent.md)

#### Overrides

HTMLElementEventMap.touchcancel

#### Defined in

[event-map.ts:31](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L31)

___

### touchend

• **touchend**: [`InfiniteCanvasTouchEvent`](api/interfaces/InfiniteCanvasTouchEvent.md)

#### Overrides

HTMLElementEventMap.touchend

#### Defined in

[event-map.ts:30](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L30)

___

### touchignored

• **touchignored**: `Event`

#### Defined in

[event-map.ts:24](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L24)

___

### touchmove

• **touchmove**: [`InfiniteCanvasTouchEvent`](api/interfaces/InfiniteCanvasTouchEvent.md)

#### Overrides

HTMLElementEventMap.touchmove

#### Defined in

[event-map.ts:29](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L29)

___

### touchstart

• **touchstart**: [`InfiniteCanvasTouchEvent`](api/interfaces/InfiniteCanvasTouchEvent.md) & [`InfiniteCanvasEventWithDefaultBehavior`](api/interfaces/InfiniteCanvasEventWithDefaultBehavior.md)

#### Overrides

HTMLElementEventMap.touchstart

#### Defined in

[event-map.ts:28](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L28)

___

### transformationchange

• **transformationchange**: [`TransformationEvent`](api/interfaces/TransformationEvent.md)

Emitted when [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) transforms (for example when the user pans)

#### Defined in

[event-map.ts:14](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L14)

___

### transformationend

• **transformationend**: [`TransformationEvent`](api/interfaces/TransformationEvent.md)

Emitted when [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) has finished transforming

#### Defined in

[event-map.ts:18](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L18)

___

### transformationstart

• **transformationstart**: [`TransformationEvent`](api/interfaces/TransformationEvent.md)

Emitted when [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) begins transforming (for example when the user begins to pan)

#### Defined in

[event-map.ts:10](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L10)

___

### wheel

• **wheel**: `WheelEvent` & [`InfiniteCanvasEventWithDefaultBehavior`](api/interfaces/InfiniteCanvasEventWithDefaultBehavior.md)

#### Overrides

HTMLElementEventMap.wheel

#### Defined in

[event-map.ts:27](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L27)

___

### wheelignored

• **wheelignored**: `Event`

#### Defined in

[event-map.ts:23](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/event-map.ts#L23)
