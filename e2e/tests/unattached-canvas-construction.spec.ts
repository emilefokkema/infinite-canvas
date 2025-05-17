import { describe, it } from 'vitest'
import { noError } from './utils/next-event'

describe('given a page', () => {

    it('should create an InfiniteCanvas from an unattached canvas', async () => {
        await Promise.all([
            noError(page.page, 500),
            page.page.evaluate(() => {
                window.TestPageLib.createInfiniteCanvas(document.createElement("canvas"))
            })
        ])
    })
})