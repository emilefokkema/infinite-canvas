/// <reference types="../../../../test-cases/frontend/test-cases-list" />

import testCases from 'virtual:test-cases-list'
import { createTestCaseRouter } from './test-case-router';
import { createRegularDisplay } from './regular-display';
import { createInfiniteDisplay } from './infinite-display';
import { createCanvasElement } from './canvas-element';

let testCaseId: string | undefined;
const regularDisplay = createRegularDisplay(
    createCanvasElement('regular-canvas-container')
);
const infiniteDisplay = createInfiniteDisplay(
    createCanvasElement('infinite-canvas-container')
)
const testCaseRouter = createTestCaseRouter();
function drawTestCase(): void{
    const newTestCaseId = testCaseRouter.getTestCaseId();
    if(newTestCaseId === testCaseId){
        return;
    }
    testCaseId = newTestCaseId;
    const testCaseEntry = testCases.find(({id}) => id === testCaseId);
    if(!testCaseEntry){
        return;
    }
    const testCase = testCaseEntry.testCase;
    regularDisplay.displayTestCase(testCase);
    infiniteDisplay.displayTestCase(testCase);
}
drawTestCase();
window.addEventListener('hashchange', () => {
    drawTestCase();
})
