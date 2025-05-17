import { launch, type Browser } from 'puppeteer'
import { createPool, type Pool } from 'generic-pool'
import { Browser as PageFactoryBrowser } from '../shared/browser'

function createBrowserPool(headless: boolean): Pool<Browser> {
    return createPool({
        async create(): Promise<Browser>{
            try{
                return await launch({headless, args: ['--no-sandbox']})
            }catch(e){
                console.error('error launching browser', e)
                throw e;
            }
            
        },
        destroy(browser: Browser): Promise<void>{
            return browser.close();
        }
    }, {max: 3})
}

export class BrowserPool{
    private inUse: {[id: string]: Browser} = {}
    private pool: Pool<Browser>;
    public constructor(headless: boolean){
        this.pool = createBrowserPool(headless);
    }
    public async acquireBrowser(): Promise<PageFactoryBrowser>{
        const browser = await this.pool.acquire();
        const wsEndpoint = browser.wsEndpoint();
        this.inUse[wsEndpoint] = browser;
        return {wsEndpoint};
    }
    public async releaseBrowser({wsEndpoint}: PageFactoryBrowser): Promise<void>{
        const browserInUse = this.inUse[wsEndpoint];
        if(!browserInUse){
            throw new Error(`Cannot release browser '${wsEndpoint}' because it is not in use`)
        }
        delete this.inUse[wsEndpoint]
        await this.pool.release(browserInUse);
    }
    public async destroy(): Promise<void>{
        await this.pool.drain();
        await this.pool.clear();
    }
}