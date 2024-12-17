export interface EventMessage{
    type: 'event'
    eventType: keyof any
    serializedEvent: unknown
}

export interface ConnectionEventMessage {
    connectionId: string
    message: EventMessage
}