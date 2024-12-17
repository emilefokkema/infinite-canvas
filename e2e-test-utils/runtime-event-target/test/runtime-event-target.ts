import { EventTargetLike } from '../shared/event-target-like'
import { SerializedValue, SerializablePropertyChart, ChartMap } from '../shared/serializable-types';

export type ExtendedSerializedMap<
    TMap,
    TSerializedMap,
    TChartMap extends ChartMap<TMap>
    > = TSerializedMap & {
        [type in (keyof TChartMap & keyof TMap)]:
            TChartMap[type] extends SerializablePropertyChart<TMap[type]>
            ? SerializedValue<TMap[type], TChartMap[type]>
            : never
    }

export interface RuntimeEventTarget<TMap, TSerializedMap = {}> extends EventTargetLike<Pick<TSerializedMap, keyof TMap & keyof TSerializedMap>>{
    emitEvents<TChartMap extends ChartMap<TMap>>(map: TChartMap): Promise<RuntimeEventTarget<TMap, ExtendedSerializedMap<TMap, TSerializedMap, TChartMap>>>
    handleEvents<TType extends (keyof TMap & keyof TSerializedMap)>(
        type: TType,
        addHandler: (handlerAdder: (handler: (e: TMap[TType]) => void) => void) => void
    ): Promise<void>
    switchToCapture(type: keyof TMap & keyof TSerializedMap): Promise<void>
}