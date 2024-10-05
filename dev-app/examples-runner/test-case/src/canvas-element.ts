import type { TestCaseDistortion } from "test-case";

export interface CanvasElement{
    ctx: CanvasRenderingContext2D;
    el: HTMLCanvasElement;
    applyDistortion(distortion: TestCaseDistortion): void
    reset(): void
}

export function createCanvasElement(el: HTMLCanvasElement): CanvasElement{
    const width = el.width;
    const height = el.height;
    const ctx = el.getContext('2d') as CanvasRenderingContext2D;
    function reset(): void{
        el.width = width;
        el.height = height;
        el.style.removeProperty('width')
        el.style.removeProperty('height')
    }
    function applyDistortion(distortion: TestCaseDistortion): void{
        el.style.width = distortion.screenWidth;
        el.style.height = distortion.screenHeight;
        el.width = distortion.viewboxWidth;
        el.height = distortion.viewboxHeight;
    }
    return { el, ctx, reset, applyDistortion }
}