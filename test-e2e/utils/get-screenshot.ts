import type { Page } from 'puppeteer' 

export function getScreenshot(page: Page): Promise<Buffer>{
    return page.screenshot({
        clip: {
            x: 0,
            y: 0,
            width: 400,
            height: 400
        }
    });
}