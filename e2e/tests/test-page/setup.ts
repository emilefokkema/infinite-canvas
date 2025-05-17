/// <reference types="../../test-page-app/api/env" />
import { beforeAll, inject } from 'vitest'
import { JSHandle } from 'puppeteer';
import { TestPage } from "./test-page";
import { getPage } from '../../../e2e-test-utils/page-factory/test/get-page'
import { SERVER_BASE_URL } from '../../shared/constants'
import { CanvasElementInitialization } from '../../test-page-app/api/configuration';
import type { Config } from 'api'
import { createInfiniteCanvas } from './create-infinite-canvas'
import '../utils/image-snapshots/expect-extensions'
import { EventTargetHandle, EventTargetLike, EventTargetHandleFactory, createEventTargetHandleFactory } from 'puppeteer-event-target-handle'

declare global{
    var page: TestPage
}

beforeAll(async () => {
    if(globalThis.page !== undefined){
        throw new Error('The page already exists!')
    }
    const pageFactoryOptions = inject('pageFactoryOptions')
    const pageFactoryPage = await getPage(pageFactoryOptions)
    let { eventTargetHandleFactory } = await preparePage();
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
        createEventTargetHandle<TMap>(target: JSHandle<EventTargetLike<TMap>>): Promise<EventTargetHandle<TMap>> {
            return eventTargetHandleFactory(target);
        },
        disableTouchAction(): Promise<void>{
            return pageFactoryPage.page.evaluate(() => window.TestPageLib.disableTouchAction());
        },
        createCanvasElement: (config: CanvasElementInitialization) => {
            return pageFactoryPage.page.evaluateHandle((config) => window.TestPageLib.createCanvasElement(config), config)
        },
        createInfiniteCanvas: (canvasElement: JSHandle<HTMLCanvasElement>, config?: Partial<Config>) => {
            return createInfiniteCanvas(canvasElement, eventTargetHandleFactory, config)
        },
        measureText(
            canvas: JSHandle<{getContext(id: '2d'): CanvasRenderingContext2D}>,
            text: string
        ){
            return canvas.evaluate((c, text) => window.TestPageLib.measureText(c, text), text)
        },
        async reload(){
            await pageFactoryPage.reload();
            ({eventTargetHandleFactory} = await preparePage());
        }
    }
    async function preparePage(): Promise<{eventTargetHandleFactory: EventTargetHandleFactory }>{
        const page = pageFactoryPage.page;
        await page.goto(SERVER_BASE_URL, {waitUntil: 'domcontentloaded'})
        await setSize(600, 600)
        const eventTargetHandleFactory = await createEventTargetHandleFactory(page);
        return { eventTargetHandleFactory }
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