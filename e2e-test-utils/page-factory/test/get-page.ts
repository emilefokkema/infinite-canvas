import { Page as PuppeteerPage, connect } from 'puppeteer'
import { Options } from '../shared/options'
import { Browser } from '../shared/browser'

export interface Page{
    page: PuppeteerPage
    close(): Promise<void>
    reload(): Promise<void>
}
export async function getPage({baseUrl}: Options): Promise<Page>{
    const result = await fetch(baseUrl);
    const { wsEndpoint } = await result.json() as Browser
    const browser = await connect({browserWSEndpoint: wsEndpoint})
    let page = await createNewPage();
   
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
    async function reload(): Promise<void> {
        page = await createNewPage();
    }
    async function createNewPage(): Promise<PuppeteerPage>{
        const page = await browser.newPage();
        const existingPages = await browser.pages();
        await Promise.all(existingPages.filter(p => p !== page).map(p => p.close()));
        return page;
    }
    return { get page(){return page;}, close, reload }
}