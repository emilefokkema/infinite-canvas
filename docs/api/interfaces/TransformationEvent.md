[ef-infinite-canvas](api/README.md) / TransformationEvent

# Interface: TransformationEvent

## Hierarchy

- `Event`

- [`Transformed`](api/interfaces/Transformed.md)

  ↳ **`TransformationEvent`**

## Properties

### inverseTransformation

• `Readonly` **inverseTransformation**: [`TransformationRepresentation`](api/interfaces/TransformationRepresentation.md)

The inverse of [transformation](api/interfaces/TransformationEvent.md#transformation)

#### Inherited from

[Transformed](api/interfaces/Transformed.md).[inverseTransformation](api/interfaces/Transformed.md#inversetransformation)

#### Defined in

[transformed.ts:11](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/transformed.ts#L11)

___

### transformation

• `Readonly` **transformation**: [`TransformationRepresentation`](api/interfaces/TransformationRepresentation.md)

The transformation that, when applied to a point `(x, y)` in the CSS-pixel-base coordinate system of the `<canvas>` (which has its origin at the top-left corner of the canvas), returns the corresponding point in the [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)'s coordinate system

#### Inherited from

[Transformed](api/interfaces/Transformed.md).[transformation](api/interfaces/Transformed.md#transformation)

#### Defined in

[transformed.ts:7](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/transformed.ts#L7)
