export function createSocketMessageListener<TMessage>(
    predicate: (message: unknown) => message is TMessage,
    listener: (message: TMessage) => void
): (e: {data: unknown}) => void{
    return ({data}) => {
        if(typeof data !== 'string'){
            return;
        }
        try{
            const parsed = JSON.parse(data);
            if(!predicate(parsed)){
                return;
            }
            listener(parsed)
        }catch{
            return
        }
    }
}