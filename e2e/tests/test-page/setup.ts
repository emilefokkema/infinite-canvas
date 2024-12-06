/// <reference types="../../test-page-app/api/env" />
import { beforeAll, inject } from 'vitest'
import { JSHandle } from 'puppeteer';
import { TestPage } from "./test-page";
import { getPage } from '../../../e2e-test-utils/page-factory/test/get-page'
import { initializeEventTargetFactory } from '../../../e2e-test-utils/runtime-event-target/test/initialize-event-target-factory'
import { SERVER_BASE_URL } from '../../shared/constants'
import { CanvasElementInitialization } from '../../test-page-app/api/configuration';
import type { Config } from 'api'
import { createInfiniteCanvas } from './create-infinite-canvas'
import '../utils/image-snapshots/expect-extensions'
import { EventTargetLike } from '../../../e2e-test-utils/runtime-event-target/shared/event-target-like';
import { RuntimeEventTarget } from '@runtime-event-target/test';

declare global{
    var page: TestPage
}

beforeAll(async () => {
    if(globalThis.page !== undefined){
        throw new Error('The page already exists!')
    }
    const pageFactoryOptions = inject('pageFactoryOptions')
    const runtimeEventTargetOptions = inject('runtimeEventTargetOptions')
    const {page, close: closePage } = await getPage(pageFactoryOptions)
    await page.goto(SERVER_BASE_URL, {waitUntil: 'domcontentloaded'})
    await setSize(600, 600)
    let eventTargetFactory = await initializeEventTargetFactory(page, runtimeEventTargetOptions)
    globalThis.page = {
        page,
        setSize,
        get mouse(){return page.mouse;},
        get touchscreen(){return page.touchscreen;},
        get keyboard(){return page.keyboard},
        async getScreenshot(){
            const array = await page.screenshot({
                clip: {
                    x: 0,
                    y: 0,
                    width: 400,
                    height: 400
                }
            });
            return Buffer.from(array);
        },
        createEventTarget<TMap>(target: JSHandle<EventTargetLike<TMap>>): Promise<RuntimeEventTarget<TMap>>{
            return eventTargetFactory.createEventTarget(target);
        },
        disableTouchAction(): Promise<void>{
            return page.evaluate(() => window.TestPageLib.disableTouchAction());
        },
        createCanvasElement: (config: CanvasElementInitialization) => {
            return page.evaluateHandle((config) => window.TestPageLib.createCanvasElement(config), config)
        },
        createInfiniteCanvas: (canvasElement: JSHandle<HTMLCanvasElement>, config?: Partial<Config>) => {
            return createInfiniteCanvas(canvasElement, eventTargetFactory, config)
        },
        measureText(
            canvas: JSHandle<{getContext(id: '2d'): CanvasRenderingContext2D}>,
            text: string
        ){
            return canvas.evaluate((c, text) => window.TestPageLib.measureText(c, text), text)
        },
        async reload(){
            await page.reload({waitUntil: 'domcontentloaded'})
            await setSize(600, 600)
            eventTargetFactory = await initializeEventTargetFactory(page, runtimeEventTargetOptions)
        }
    }
    function setSize(width: number, height: number): Promise<void>{
        return page.setViewport({width, height, deviceScaleFactor: 1, hasTouch: true});
    }
    return async () => {
        await closePage();
    }
})