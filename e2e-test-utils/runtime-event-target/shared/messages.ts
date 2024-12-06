export interface TestSideConnectedMessage{
    type: 'testsideconnected'
}

export interface PageSideReadyMessage{
    type: 'pagesideready'
}

export interface EventMessage{
    type: 'event'
    eventType: keyof any
    serializedEvent: unknown
}