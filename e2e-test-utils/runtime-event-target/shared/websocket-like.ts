export interface WebSocketLike{
    addEventListener(event: 'open', listener: () => void): void
    removeEventListener(event: 'open', listener: () => void): void
    addEventListener(event: 'error', listener: (e: unknown) => void): void
    removeEventListener(event: 'error', listener: (e: unknown) => void): void
    addEventListener(event: 'message', listener: (e: {data: unknown}) => void): void
    removeEventListener(event: 'message', listener: (e: {data: unknown}) => void): void
}