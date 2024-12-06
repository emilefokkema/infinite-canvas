type PropertyType<T> = T[keyof T]
type KeysNotOfType<T, TOther> = PropertyType<{[key in keyof T]: T[key] extends TOther ? never : key}>
type NotSerializable = (...args: unknown[]) => unknown
type SerializablePropertyKeys<T> = KeysNotOfType<T, NotSerializable>
export type Primitive = undefined | null | number | symbol | string | bigint | boolean
type Indexable<TItem> = {[key: number]: TItem}


export type ObjectSerializablePropertyChart<TObject, TKey extends keyof TObject> = {[key in (TKey & SerializablePropertyKeys<TObject>)]?: SerializablePropertyChart<TObject[key]>}
export type IndexableSerializablePropertyChart<TObject, TItem> = {0?: SerializablePropertyChart<TItem>} & ObjectSerializablePropertyChart<TObject, Exclude<keyof TObject, number>>
export type SerializablePropertyChart<T> =
    T extends Primitive ? true :
    T extends (infer TItem)[] ? SerializablePropertyChart<TItem> :
    T extends Indexable<infer TItem> ? IndexableSerializablePropertyChart<T, TItem> :
    ObjectSerializablePropertyChart<T, SerializablePropertyKeys<T>>

export type ChartMap<TMap> = {[key in keyof TMap]?: SerializablePropertyChart<TMap[key]>}


export type SerializedObjectValue<TObject, TKey extends keyof TObject, TChart> = {
    [key in (keyof TChart) & TKey]: TChart[key] extends SerializablePropertyChart<TObject[key]> ? SerializedValue<TObject[key], TChart[key]> : never
}

export type SerializedIndexableValue<
    TItem,
    TObject extends Indexable<TItem>,
    TChart extends IndexableSerializablePropertyChart<TObject, TItem>
    > = 
        (0 extends keyof TChart ? {
            [key: number]: SerializedValue<TItem, TChart[0]>
        } : {}) & SerializedObjectValue<TObject, Exclude<keyof TObject, number>, TChart>

export type SerializedValue<TValue, TChart extends SerializablePropertyChart<TValue>> = 
    TValue extends Primitive ? (TChart extends true ? TValue : never) :
    TValue extends (infer TItem)[] ? (TChart extends SerializablePropertyChart<TItem> ? SerializedValue<TValue, TChart> : never) :
    TValue extends Indexable<infer TItem> ? (TChart extends IndexableSerializablePropertyChart<TValue, TItem> ? SerializedIndexableValue<TItem, TValue, TChart> : never) :
    SerializedObjectValue<TValue, SerializablePropertyKeys<TValue>, TChart>