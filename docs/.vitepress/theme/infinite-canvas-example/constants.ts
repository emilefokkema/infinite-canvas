import { getMessages } from '../../../../utils/window-messages'

export interface ExampleCanvasEventMap{
    'wheelignored': {}
    'touchignored': {}
}

export const messages = getMessages<ExampleCanvasEventMap>()