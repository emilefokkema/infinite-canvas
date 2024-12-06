import { describe, it, beforeAll, afterAll } from 'vitest'
import type { Page } from 'puppeteer'
import type { InfiniteCanvasCtr } from 'infinite-canvas'
import { getPage, getResultAfter, ensureNoError } from './utils'
import '../test-utils/expect-extensions'

describe('given a page', () => {
    let page: Page;
    let cleanup: () => Promise<void>;

    beforeAll(async () => {
        ({page, cleanup } = await getPage());
    })

    it('should create an InfiniteCanvas from an unattached canvas', async () => {
        await getResultAfter(async () => {
            await page.evaluate(() => {
                const InfiniteCanvas: InfiniteCanvasCtr = window.TestPageLib.InfiniteCanvas;
                const c = new InfiniteCanvas(document.createElement("canvas"))
            })
        }, [() => ensureNoError(page, 500)])
    })

    afterAll(async () => {
        await cleanup();
    })
})