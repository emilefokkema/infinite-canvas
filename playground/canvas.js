import once from '../build-utils/once';

const baseURIOrigin = new URL(document.baseURI).origin;
const canvas = document.getElementById('canvas');
let infiniteCanvas;
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function getRangeInFunctionWhereErrorOriginated(error, scriptUrl){
    const regexp = new RegExp(`${escapeRegex(scriptUrl)}:(\\d+):(\\d+)`);
    const stack = error.stack;
    if(!stack){
        return null;
    }
    const match = stack.match(regexp);
    if(match === null){
        return null;
    }
    const row = parseInt(match[1]);
    const column = parseInt(match[2]);
    return {
        startRow: row - 2,
        startColumn: column - 1,
        endRow: row - 1,
        endColumn: 0
    };
}
function addAdditionalConfig(additionalConfig){
    if(!infiniteCanvas){
        return;
    }
    infiniteCanvas.units = additionalConfig.units;
    infiniteCanvas.greedyGestureHandling = additionalConfig.greedyGestureHandling;
    infiniteCanvas.rotationEnabled = additionalConfig.rotationEnabled;
}
function executeInstruction(instruction){
    return new Promise((res) => {
        res = once(res);
        canvas.width = instruction.width;
        canvas.height = instruction.height;
        
        infiniteCanvas = new InfiniteCanvas(canvas, {
            greedyGestureHandling: instruction.greedyGestureHandling,
            rotationEnabled: instruction.rotationEnabled,
            units: instruction.units
        });
        const ctx = infiniteCanvas.getContext('2d');
        const scriptContent = `function doExecute(ctx, parent){\n${instruction.code}\n}`;
        const blob = new Blob([scriptContent], {type : 'text/javascript'});
        const objectURL = URL.createObjectURL(blob);
        const scriptTag = document.createElement('script');
        let scriptGaveError = false;
        scriptTag.addEventListener('load', () => {
            if(scriptGaveError){
                return;
            }
            try{
                doExecute.apply({}, [ctx]);
                res({});
            }catch(e){
                const message = e.toString();
                const range = getRangeInFunctionWhereErrorOriginated(e, objectURL);
                res({
                    error: { message, range }
                });
            }finally{
                URL.revokeObjectURL(objectURL);
            }
        })
        addEventListener('error', (errorEvent) => {
            if(errorEvent.filename === objectURL){
                const error = errorEvent.error;
                const message = error.toString();
                const range = getRangeInFunctionWhereErrorOriginated(error, objectURL);
                if(!res({
                    error: { message, range }
                })){
                    parent.postMessage({type: 'error', error: {message, range}})
                }
                scriptGaveError = true;
            }
        });
        document.body.appendChild(scriptTag);
        scriptTag.src = objectURL;
    });
}
addEventListener('message', (event) => {
    if(event.source !== parent || event.origin !== baseURIOrigin){
        return;
    }
    const data = event.data;
    if(data.type === 'instruction'){
        const instruction = data.instruction;
        executeInstruction(instruction).then((result) => {
            parent.postMessage({type: 'executed', result});
        });
    }else if(data.type === 'additionalConfig'){
        addAdditionalConfig(data.additionalConfig);
    }
});
parent.postMessage({type: 'loaded'});