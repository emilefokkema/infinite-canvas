import { Page as PuppeteerPage, connect } from 'puppeteer'
import { Options } from '../shared/options'
import { Browser } from '../shared/browser'

export interface Page{
    page: PuppeteerPage
    close(): Promise<void>
}
export async function getPage({baseUrl}: Options): Promise<Page>{
    const result = await fetch(baseUrl);
    const { wsEndpoint } = await result.json() as Browser
    const browser = await connect({browserWSEndpoint: wsEndpoint})
    const page = await browser.newPage();
    async function close(): Promise<void>{
        browser.disconnect();
        const result = await fetch(baseUrl, {
            method: 'POST',
            body: JSON.stringify({wsEndpoint}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(result.status !== 200){
            throw new Error('failed to clean up browser!')
        }
    }
    return { page, close }
}