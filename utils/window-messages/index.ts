export interface Messages<TMap>{
    sendToParent<K extends keyof TMap>(type: K, data: TMap[K]): void;
    createMessageListener<K extends keyof TMap>(
        otherWindow: Window,
        type: K,
        listener: (ev: TMap[K]) => void): (e: MessageEvent) => void
}

interface MessageData<TMap>{
    type: keyof TMap
    data: TMap[keyof TMap]
}

export function getMessages<TMap>(): Messages<TMap>{
    function sendToParent<K extends keyof TMap>(type: K, data: TMap[K]): void{
        const parent = window.parent;
        if(!parent){
            return;
        }
        const message: MessageData<TMap> = {type, data};
        parent.postMessage(message);
    }

    function createMessageListener<K extends keyof TMap>(
        otherWindow: Window,
        type: K,
        listener: (ev: TMap[K]) => void): (e: MessageEvent) => void{
            return (e) => {
                let data;
                if(e.source !== otherWindow || (data = e.data).type !== type){
                    return;
                }
                listener(data.data);
            };
    }

    return { sendToParent, createMessageListener }
}