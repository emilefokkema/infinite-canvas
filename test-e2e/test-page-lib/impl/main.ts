import { type EventTarget, type CanvasElementWrapper, type CanvasElementInitialization, type InfiniteCanvasInitialization, type AttachedEventListener, EVENT_LISTENER_DATA } from '../api'
import InfiniteCanvasCtr from 'infinite-canvas';
import type { InfiniteCanvas } from 'infinite-canvas-api';
import { openTestingMessagePort } from '../../testing-message-ports/open-testing-message-port';
import './index.css';

let testingMessagePort: WebSocket;

function initializeCanvasElement(config: CanvasElementInitialization): CanvasElementWrapper{
    const {
        styleWidth,
        styleHeight,
        canvasWidth,
        canvasHeight,
        spaceBelowCanvas,
    } = config;
    const canvasEl = document.createElement('canvas');
    document.body.appendChild(canvasEl);
    canvasEl.style.width = styleWidth;
    canvasEl.style.height = styleHeight;
    canvasEl.style.position = 'absolute';
    if(typeof canvasWidth === 'number' && typeof canvasHeight === 'number'){
        canvasEl.width = canvasWidth;
        canvasEl.height = canvasHeight;
    }else{
        const {width: rectWidth, height: rectHeight} = canvasEl.getBoundingClientRect();
        canvasEl.width = canvasWidth === 'boundingclientrect' ? rectWidth : canvasWidth;
        canvasEl.height = canvasHeight === 'boundingclientrect' ? rectHeight : canvasHeight;
    }
    if(spaceBelowCanvas !== undefined){
        const belowCanvas = document.createElement('div');
        document.body.appendChild(belowCanvas);
        belowCanvas.style.width = `100px`;
        belowCanvas.style.height = `${spaceBelowCanvas}px`;
    }
    
    return {canvasEl, initializeInfiniteCanvas};

    async function initializeInfiniteCanvas(config: InfiniteCanvasInitialization): Promise<InfiniteCanvas>{
        const {
            greedyGestureHandling,
            rotationEnabled,
            units,
            drawing
        } = config;
        const infCanvas = new InfiniteCanvasCtr(canvasEl);
        if(greedyGestureHandling !== undefined){
            infCanvas.greedyGestureHandling = greedyGestureHandling;
        }
        if(rotationEnabled !== undefined){
            infCanvas.rotationEnabled = rotationEnabled;
        }
        if(units !== undefined){
            infCanvas.units = units === 0 ? InfiniteCanvasCtr.CSS_UNITS : InfiniteCanvasCtr.CANVAS_UNITS;
        }
        const context = infCanvas.getContext();
        await new Promise<void>((res) => {
            const listener = () => {
                infCanvas.removeEventListener('draw', listener)
                res();
            };
            infCanvas.addEventListener('draw', listener);
            drawing(context);
        });
        return infCanvas;
    }
}

async function initializeInfiniteCanvas(config: CanvasElementInitialization & InfiniteCanvasInitialization): Promise<InfiniteCanvas>{
    const wrapper = initializeCanvasElement(config);
    return await wrapper.initializeInfiniteCanvas(config);
}

function getPropertyNames(o: any): string[]{
    const result: string[] = [];
    do{
        for(let name of Object.getOwnPropertyNames(o)){
            if(name !== '__proto__' && !result.includes(name)){
                result.push(name)
            }
        }
        o = Object.getPrototypeOf(o);
    }while(o);
    return result;
}

function stringify(e: any, level: number): string | undefined{
    const t = typeof e;
    if(t === 'undefined' || t === 'function'){
        return undefined;
    }
    if(!e || t === 'string' || t === 'number' || t === 'boolean' || t === 'symbol' || t === 'bigint'){
        return JSON.stringify(e)
    }
    if(level === 0){
        return undefined;
    }
    if(Array.isArray(e)){
        const itemStrings: string[] = [];
        for(let item of e){
            const stringified = stringify(item, level - 1);
            itemStrings.push(stringified === undefined ? 'null' : stringified)
        }
        return `[${itemStrings.join(',')}]`
    }
    const entries: {key: string, stringified: string}[] = [];
    for(let key of getPropertyNames(e)){
        let value;
        try{
            value = e[key];
        }catch(e){
            value = e.toString();
        }
        const stringified = stringify(value, level - 1);
        if(stringified === undefined || stringified === 'null'){
            continue;
        }
        entries.push({key, stringified})
    }
    return `{${entries.map(({key, stringified}) => `"${key}": ${stringified}`).join(',')}}`
}

async function openMessagePort(url: string): Promise<void>{
    testingMessagePort = await openTestingMessagePort(() => new WebSocket(url));
}

function addEventListener<
    TEventName,
    TEventType,
    TEventTarget extends EventTarget<TEventType, TEventName>
    >(target: TEventTarget, name: TEventName, capture: boolean | undefined, eventListenerId: string): AttachedEventListener<TEventType>{
        let handler: (e: TEventType) => void = ()  => {};
        const listener: (e: TEventType) => void = (e) => {
            handler(e);
            testingMessagePort.send(`{"type": "${EVENT_LISTENER_DATA}", "id": "${eventListenerId}", "data": ${stringify(e, 3)}}`);
        };
        target.addEventListener(name, listener, capture);
        function setHandler(value: (e: TEventType) => void): void{
            handler = value;
        }
        function remove(): void{
            target.removeEventListener(name, listener, capture);
        }
        return { setHandler, remove };
}

function makeSerializableTextMetrics(textMetrics: TextMetrics): TextMetrics{
    const { 
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        actualBoundingBoxLeft,
        actualBoundingBoxRight,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        width } = textMetrics;
    return { 
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        actualBoundingBoxLeft,
        actualBoundingBoxRight,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        width }
}

window.TestPageLib = {
    initializeCanvasElement,
    initializeInfiniteCanvas,
    openMessagePort,
    addEventListener,
    makeSerializableTextMetrics
};