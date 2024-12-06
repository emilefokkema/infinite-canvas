import type { DetachableCanvasElement } from '../../api/detachable-canvas-element'
import type { ResizeEvent } from '../../api/resize-event';

export function createDetachableCanvasElement(): DetachableCanvasElement{
    const listeners: ((e: ResizeEvent) => void)[] = [];
    const observer = new ResizeObserver(([entry]) => {
        notifyListeners(createResizeEvent(entry));
    });
    const container = document.createElement('div')
    document.body.appendChild(container);
    const canvas = document.createElement('canvas');
    return { canvas, attach, detach, addEventListener, removeEventListener }
    function addEventListener(type: 'resize', listener: (e: ResizeEvent) => void): void{
        if(listeners.length === 0){
            observer.observe(canvas);
        }
        listeners.push(listener);
    }
    function removeEventListener(type: 'resize', listener: (e: ResizeEvent) => void): void{
        const index = listeners.indexOf(listener);
        if(index === -1){
            return;
        }
        listeners.splice(index, 1);
        if(listeners.length === 0){
            observer.disconnect();
        }
    }
    function notifyListeners(event: ResizeEvent): void{
        const listenersToNotify = listeners.slice();
        for(const listener of listenersToNotify){
            listener(event);
        }
    }
    function createResizeEvent({contentRect: {width, height}}: ResizeObserverEntry): ResizeEvent{
        if(width === 0 || height === 0){
            return {positiveSize: false}
        }
        return {positiveSize: true}
    }
    function attach(){
        container.appendChild(canvas)
    }
    function detach(){
        canvas.remove();
    }
}