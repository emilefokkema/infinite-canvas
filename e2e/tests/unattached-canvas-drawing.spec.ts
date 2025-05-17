import { describe, it } from 'vitest'
import { noError } from './utils/next-event'

describe('given a page', () => {

    it('should create an InfiniteCanvas from an unattached canvas', async () => {
        await Promise.all([
            noError(page.page, 500),
            page.page.evaluate(() => {
                const c = window.TestPageLib.createInfiniteCanvas(document.createElement("canvas"));
                c.getContext('2d').fillRect(0, 0, 10, 10)
            })
        ])
    })
})