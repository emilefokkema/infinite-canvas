import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { JSHandle, type Page } from 'puppeteer'
import { getPage, getTouchCollection } from './utils'
import type { InfiniteCanvas } from 'infinite-canvas'
import { getEnvironmentSuffix } from '../test-utils/get-environment-suffix'

describe('when we measure text', () => {
    let page: Page;
    let cleanup: () => Promise<void>;
    let infCanvasHandle: JSHandle<InfiniteCanvas>

    beforeAll(async () => {
        ({page, cleanup } = await getPage());
        infCanvasHandle = await page.evaluateHandle(() => window.TestPageLib.initializeInfiniteCanvas({
            styleWidth: '200px',
            styleHeight: '200px',
            canvasWidth: 200,
            canvasHeight: 200,
            drawing(ctx){
                ctx.fillRect(100, 100, 200, 100);
            }
        }))
    })

    it('should return this text measurement', async () => {
        const result = await infCanvasHandle.evaluate((c) => window.TestPageLib.makeSerializableTextMetrics(c.getContext('2d').measureText('Hello World')))
        expect(result).toMatchSnapshot(getEnvironmentSuffix(['gitpod', 'CI']))
    })

    describe('and then the font is changed', () => {

        beforeAll(async () => {
            await infCanvasHandle.evaluate((c) => c.getContext('2d').font = '12px sans-serif')
        })

        it('should return this text measurement', async () => {
            const result = await infCanvasHandle.evaluate((c) => window.TestPageLib.makeSerializableTextMetrics(c.getContext('2d').measureText('Hello World')))
            expect(result).toMatchSnapshot(getEnvironmentSuffix(['gitpod', 'CI']))
        })
    })

    describe('and then a transformation happens', () => {

        beforeAll(async () => {
            const touchCollection = await getTouchCollection(page);
            const touch1 = await touchCollection.start(20, 20);
            const touch2 = await touchCollection.start(100, 100);
            await touch2.move(150, 100);
            await touch2.end();
            await touch1.end();
        })

        it('should return this text measurement', async () => {
            const result = await infCanvasHandle.evaluate((c) => window.TestPageLib.makeSerializableTextMetrics(c.getContext('2d').measureText('Hello World')))
            expect(result).toMatchSnapshot(getEnvironmentSuffix(['gitpod', 'CI']))
        })
    })

    afterAll(async () => {
        await cleanup();
    })
})