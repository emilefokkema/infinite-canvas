import { EventMap } from "api/event-map";

type KeysOfPropertiesOfType<TType, TProp> = {[K in keyof TType]: TType[K] extends TProp ? K : never}[keyof TType];
type KeysOfPropertiesOfExactlyType<TType, TProp> = {[K in keyof TType]: TType[K] extends TProp ? TProp extends TType[K] ? K : never: never}[keyof TType]
type OnlyPropertiesOfExactlyType<TType, TProp> = Pick<TType, KeysOfPropertiesOfExactlyType<TType, TProp>>;

export type DrawEventMap = Pick<EventMap, 'draw'>;
export type TransformationEventMap = Pick<EventMap, 'transformationstart' | 'transformationchange' | 'transformationend'>;
type HandledOrFilteredEventTypes = 
    'mousemove' |
    'mousedown' |
    'pointerdown' |
    'pointermove' |
    'pointerup' |
    'pointerleave' |
    'pointercancel' |
    'wheel' |
    'touchstart' |
    'touchmove' |
    'wheelignored' |
    'touchignored';

type TouchEventTypes = KeysOfPropertiesOfType<EventMap, TouchEvent>;
type MappedTouchEventTypes = Exclude<TouchEventTypes, HandledOrFilteredEventTypes>
type MouseEventTypes = KeysOfPropertiesOfType<EventMap, MouseEvent>;

export type PointerEventMap = Pick<EventMap, TouchEventTypes | MouseEventTypes | HandledOrFilteredEventTypes>;
export type HandledOrFilteredEventMap = Pick<EventMap, HandledOrFilteredEventTypes>
export type MappedPointerEventMap = Omit<PointerEventMap, keyof HandledOrFilteredEventMap>

export type MappedMouseEventMap = OnlyPropertiesOfExactlyType<MappedPointerEventMap, MouseEvent>
export type MappedOnlyPointerEventMap = OnlyPropertiesOfExactlyType<MappedPointerEventMap, PointerEvent>
export type MappedDragEventMap = OnlyPropertiesOfExactlyType<MappedPointerEventMap, DragEvent>
export type MappedTouchEventMap = Pick<EventMap, MappedTouchEventTypes>
export type UnmappedEventMap = Omit<EventMap, keyof DrawEventMap | keyof TransformationEventMap | keyof PointerEventMap>

const transformationEventKeyCollection: {[K in keyof TransformationEventMap]: null} = {
    transformationstart: null,
    transformationchange: null,
    transformationend: null
};

const mappedMouseEventKeyCollection: {[K in keyof MappedMouseEventMap]: null} = {
    auxclick: null,
    click: null,
    contextmenu: null,
    dblclick: null,
    mouseenter: null,
    mouseleave: null,
    mouseout: null,
    mouseover: null,
    mouseup: null
};

const mappedOnlyPointerEventKeyCollection: {[K in keyof MappedOnlyPointerEventMap]: null} = {
    gotpointercapture: null,
    lostpointercapture: null,
    pointerenter: null,
    pointerout: null,
    pointerover: null
};

const mappedDragEventKeyCollection: {[K in keyof MappedDragEventMap]: null} = {
    drag: null,
    dragend: null,
    dragenter: null,
    dragleave: null,
    dragover: null,
    dragstart: null,
    drop: null
};

const mappedTouchEventKeyCollection: {[K in keyof MappedTouchEventMap]: null} = {
    touchcancel: null,
    touchend: null
};

const mappedPointerEventKeyCollection: {[K in keyof MappedPointerEventMap]: null} = {
    ...mappedMouseEventKeyCollection,
    ...mappedOnlyPointerEventKeyCollection,
    ...mappedDragEventKeyCollection,
    ...mappedTouchEventKeyCollection
};

const handledOrFilteredEventKeyCollection: {[K in keyof HandledOrFilteredEventMap]: null} = {
    mousedown: null,
    mousemove: null,
    pointerdown: null,
    pointermove: null,
    pointerleave: null,
    pointercancel: null,
    pointerup: null,
    wheel: null,
    touchstart: null,
    touchmove: null,
    wheelignored: null,
    touchignored: null
};

export function isTransformationEventKey(key: keyof EventMap): key is keyof TransformationEventMap{
    return transformationEventKeyCollection.hasOwnProperty(key);
}

export function isPointerEventKey(key: keyof EventMap): key is keyof PointerEventMap{
    return mappedPointerEventKeyCollection.hasOwnProperty(key) || handledOrFilteredEventKeyCollection.hasOwnProperty(key);
}

export function isHandledOrFilteredEventKey(key: keyof PointerEventMap): key is keyof HandledOrFilteredEventMap{
    return handledOrFilteredEventKeyCollection.hasOwnProperty(key);
}

export function isMappedMouseEventKey(key: keyof MappedPointerEventMap): key is keyof MappedMouseEventMap{
    return mappedMouseEventKeyCollection.hasOwnProperty(key);
}

export function isMappedOnlyPointerEventKey(key: keyof MappedPointerEventMap): key is keyof MappedOnlyPointerEventMap{
    return mappedOnlyPointerEventKeyCollection.hasOwnProperty(key);
}

export function isMappedDragEventKey(key: keyof MappedPointerEventMap): key is keyof MappedDragEventMap {
    return mappedDragEventKeyCollection.hasOwnProperty(key);
}

export function isMappedTouchEventKey(key: keyof PointerEventMap): key is keyof MappedTouchEventMap{
    return mappedTouchEventKeyCollection.hasOwnProperty(key);
}

