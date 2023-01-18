[ef-infinite-canvas](api/README.md) / Config

# Interface: Config

This interface contains properties that determine the behavior of the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md).

## Hierarchy

- **`Config`**

  ↳ [`InfiniteCanvas`](api/interfaces/InfiniteCanvas.md)

## Properties

### greedyGestureHandling

• **greedyGestureHandling**: `boolean`

If `true`, this means that the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) will pan when touched with one finger, and that it will zoom when the user scrolls without pressing the Ctrl key

**`Default Value`**

false

#### Defined in

[config.ts:18](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/config.ts#L18)

___

### rotationEnabled

• **rotationEnabled**: `boolean`

Determines whether rotating the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) is possible or not

**`Default Value`**

true

#### Defined in

[config.ts:12](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/config.ts#L12)

___

### units

• **units**: [`Units`](api/enums/Units.md)

Determines the units to use when drawing on an [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)

**`Default Value`**

[CANVAS](api/enums/Units.md#canvas)

#### Defined in

[config.ts:24](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/config.ts#L24)
