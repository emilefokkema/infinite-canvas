import { ChartMap } from '../../shared/serializable-types'

export interface RuntimeEventTarget<TMap>{
    emitEvents(map: ChartMap<TMap>): void
    handleEvents<TType extends keyof TMap>(type: TType, handler: (e: TMap[TType]) => void): void
    switchToCapture(type: keyof TMap): void
}