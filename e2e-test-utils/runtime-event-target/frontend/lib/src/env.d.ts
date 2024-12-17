import { sendEventFunctionName } from '../../../shared/constants'
import { ConnectionEventMessage } from '../../../shared/messages'

declare global {
    interface Window {
        [sendEventFunctionName]: (message: ConnectionEventMessage) => void
    }
}

export {}