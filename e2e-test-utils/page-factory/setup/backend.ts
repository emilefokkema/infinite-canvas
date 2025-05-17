import { default as express, Router, json } from 'express'
import { BrowserPool } from './browser-pool';
import { Browser } from '../shared/browser'

export interface PageFactoryBackend{
    router: Router
    destroy(): Promise<void>
}
export interface PageFactoryOptions{
    headless: boolean
}
export function createBackend({headless}: PageFactoryOptions): PageFactoryBackend {
    const router = express.Router();
    const pool = new BrowserPool(headless);
    router.use(json())
    router.get('', async (req, res) => {
        res.json(await pool.acquireBrowser())
    })
    router.post('', async (req, res) => {
        const browser: Browser = req.body;
        try{
            await pool.releaseBrowser(browser);
            res.end();
        }catch(e){
            console.error(e)
            res.status(500).end()
        }
    })
    function destroy(): Promise<void>{
        return pool.destroy();
    }
    return { router, destroy }
}