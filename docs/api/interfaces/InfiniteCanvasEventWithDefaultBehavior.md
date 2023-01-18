[ef-infinite-canvas](api/README.md) / InfiniteCanvasEventWithDefaultBehavior

# Interface: InfiniteCanvasEventWithDefaultBehavior

This represents an a DOM event to which [InfiniteCanvas](api/interfaces/InfiniteCanvas.md) attaches a default behavior.

**`Example`**

```js
infCanvas.addEventListener('mousedown', e => {
    console.log(e.nativeDefaultPrevented)
    // --> `false`

    // keep the InfiniteCanvas from panning
    e.preventDefault(true);

    console.log(e.nativeDefaultPrevented);
    // --> `true`, because the original mouse event's default was also prevented
});
```

## Properties

### nativeCancelable

• `Readonly` **nativeCancelable**: `boolean`

Returns whether the default for the original DOM event is cancelable

#### Defined in

[infinite-canvas-event-with-default-behavior.ts:26](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas-event-with-default-behavior.ts#L26)

___

### nativeDefaultPrevented

• `Readonly` **nativeDefaultPrevented**: `boolean`

Returns whether the default for the original DOM event was prevented

#### Defined in

[infinite-canvas-event-with-default-behavior.ts:22](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas-event-with-default-behavior.ts#L22)

## Methods

### preventDefault

▸ **preventDefault**(`preventNativeDefault?`): `void`

Prevents [InfiniteCanvas](api/interfaces/InfiniteCanvas.md)'s default behavior from occuring

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `preventNativeDefault?` | `boolean` | whether or not to also prevent the default behavior of the 'native' event |

#### Returns

`void`

#### Defined in

[infinite-canvas-event-with-default-behavior.ts:31](https://github.com/emilefokkema/infinite-canvas/blob/65104bb/src/api-surface/infinite-canvas-event-with-default-behavior.ts#L31)
