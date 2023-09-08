interface MessageEventLike{
    data: any
}

interface WebSocketLike{
    addEventListener(eventName: 'message', listener: (e: MessageEventLike) => void): void
    removeEventListener(eventName: 'message', listener: (e: MessageEventLike) => void): void
}

export async function openTestingMessagePort<TWebSocket extends WebSocketLike>(factory: () => TWebSocket): Promise<TWebSocket>{
    const ws = factory();
    await new Promise<void>((res) => {
        const openedListener: (e: MessageEventLike) => void = (e) => {
            const data = e.data;
            if(typeof data !== 'string'){
                return;
            }
            const parsed = JSON.parse(data);
            if(!parsed || parsed.type !== 'TESTING_MESSAGE_PORT_OPEN'){
                return;
            }
            ws.removeEventListener('message', openedListener);
            res();
        }
        ws.addEventListener('message', openedListener)
    })
    return ws;
}