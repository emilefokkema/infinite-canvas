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
import { RuntimeEventTarget, EventTargetFactory } from '@runtime-event-target/test';

declare global{
    var page: TestPage
}

beforeAll(async () => {
    if(globalThis.page !== undefined){
        throw new Error('The page already exists!')
    }
    const pageFactoryOptions = inject('pageFactoryOptions')
    const runtimeEventTargetOptions = inject('runtimeEventTargetOptions')
    const pageFactoryPage = await getPage(pageFactoryOptions)
    let { eventTargetFactory } = await preparePage();
    globalThis.page = {
        get page(){return pageFactoryPage.page},
        setSize,
        get mouse(){return pageFactoryPage.page.mouse;},
        get touchscreen(){return pageFactoryPage.page.touchscreen;},
        get keyboard(){return pageFactoryPage.page.keyboard},
        async getScreenshot(){
            const array = await pageFactoryPage.page.screenshot({
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
            return pageFactoryPage.page.evaluate(() => window.TestPageLib.disableTouchAction());
        },
        createCanvasElement: (config: CanvasElementInitialization) => {
            return pageFactoryPage.page.evaluateHandle((config) => window.TestPageLib.createCanvasElement(config), config)
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
            await pageFactoryPage.reload();
            ({eventTargetFactory} = await preparePage());
        }
    }
    async function preparePage(): Promise<{eventTargetFactory: EventTargetFactory}>{
        const page = pageFactoryPage.page;
        await page.goto(SERVER_BASE_URL, {waitUntil: 'domcontentloaded'})
        await setSize(600, 600)
        const eventTargetFactory = await initializeEventTargetFactory(page, runtimeEventTargetOptions);
        return { eventTargetFactory }
    }
    async function closePage(): Promise<void>{
        await pageFactoryPage.close();
    }
    function setSize(width: number, height: number): Promise<void>{
        return pageFactoryPage.page.setViewport({width, height, deviceScaleFactor: 1, hasTouch: true});
    }
    return async () => {
        await closePage();
    }
})