[ef-infinite-canvas](api/README.md) / DrawEvent

# Interface: DrawEvent

## Hierarchy

- `Event`

- [`Transformed`](api/interfaces/Transformed.md)

  ↳ **`DrawEvent`**

## Properties

### inverseTransformation

• `Readonly` **inverseTransformation**: [`TransformationRepresentation`](api/interfaces/TransformationRepresentation.md)

The inverse of [transformation](api/interfaces/DrawEvent.md#transformation)

#### Inherited from

[Transformed](api/interfaces/Transformed.md).[inverseTransformation](api/interfaces/Transformed.md#inversetransformation)

#### Defined in

[transformed.ts:11](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/transformed.ts#L11)

___

### transformation

• `Readonly` **transformation**: [`TransformationRepresentation`](api/interfaces/TransformationRepresentation.md)

The transformation that, when applied to a point `(x, y)` in the CSS-pixel-base coordinate system of the `<canvas>` (which has its origin at the top-left corner of the canvas), returns the corresponding point in the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)'s coordinate system

#### Inherited from

[Transformed](api/interfaces/Transformed.md).[transformation](api/interfaces/Transformed.md#transformation)

#### Defined in

[transformed.ts:7](https://github.com/emilefokkema/infinite-canvas/blob/4a1afe1/src/api-surface/transformed.ts#L7)
