function isIterable(x){
    try{
        const a = [...x];
        return true;
    }catch(e){
        return false;
    }
}

module.exports = function(fn, interval){
    let argsToUse, waiting;
    return (...args) => {
        if(!isIterable(args)){
            console.log('received ...args that are not iterable:', args)
        }
        if(waiting){
            argsToUse = args;
            return;
        }
        waiting = true;
        setTimeout(() => {
            if(isIterable(argsToUse)){
                fn(...argsToUse);
            }else{
                fn();
            }
            waiting = false;
        }, interval);
    };
}