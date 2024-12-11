import type { TestCaseDistortion } from "test-case";

export interface CanvasElement{
    el: HTMLCanvasElement;
    applyDistortion(distortion: TestCaseDistortion): void
    reset(): void
}

export function createCanvasElement(parentId: string): CanvasElement{
    const parent = document.getElementById(parentId) as HTMLElement;
    let el = createCanvasElement();

    function createCanvasElement(): HTMLCanvasElement {
        const result = document.createElement('canvas');
        result.setAttribute('width', '400');
        result.setAttribute('height', '400');
        parent.appendChild(result);
        return result;
    }

    function reset(): void {
        el.remove();
        el = createCanvasElement();
    }

    function applyDistortion(distortion: TestCaseDistortion): void{
        el.style.width = distortion.screenWidth;
        el.style.height = distortion.screenHeight;
        el.width = distortion.viewboxWidth;
        el.height = distortion.viewboxHeight;
    }

    return { get el(){return el;}, reset, applyDistortion }
}