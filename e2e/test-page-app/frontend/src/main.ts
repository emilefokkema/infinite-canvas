/// <reference types="../../api/env" />
import { createCanvasElement } from './create-canvas-element'
import { createInfiniteCanvas } from './create-infinite-canvas';
import { createDetachableCanvasElement } from './create-detachable-canvas-element'
import { measureText } from './measure-text';
import { disableTouchAction } from './disable-touch-action'
import '../index.css'

console.log('hello from test app')

window.TestPageLib = { 
    createCanvasElement,
    createInfiniteCanvas,
    measureText,
    disableTouchAction,
    createDetachableCanvasElement
};