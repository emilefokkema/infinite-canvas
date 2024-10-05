import http from 'http'
import path from 'path'
import {default as express, text, type Router} from 'express'
import { fileURLToPath } from 'url'
import { launch, type Browser } from 'puppeteer'
import { createPool, type Pool } from 'generic-pool'
import { build } from 'vite'
import { connectTestingMessagePorts } from './testing-message-ports/connect-testing-message-ports';

function createBrowserPoolApi(): {api: Router, cleanup(): Promise<void>}{
    const inUse: {[id: string]: Browser} = {};
    const pool: Pool<Browser> = createPool({
        create(): Promise<Browser>{
            return launch({headless: 'new'})
        },
        destroy(browser: Browser): Promise<void>{
            return browser.close();
        }
    }, {max: 3})
    const router = express.Router();
    router.get('', async (req, res) => {
        const browser = await pool.acquire();
        const endpoint = browser.wsEndpoint();
        inUse[endpoint] = browser;
        res.end(endpoint)
    })
    router.post('', async (req, res) => {
        const endpoint = req.body;
        const browserInUse = inUse[endpoint];
        if(browserInUse){
            delete inUse[endpoint]
            await pool.release(browserInUse);
            res.end();
        }else{
            res.status(500).end()
        }
        
    })
    return {
        api: router,
        async cleanup(){
            await pool.drain();
            await pool.clear();
        }
    };
}

export default async function startServer(){
    const root = fileURLToPath(new URL('./test-page-lib/impl', import.meta.url))
    const indexHtml = path.resolve(root, 'index.html')
    const testCaseIndexHtml = path.resolve(root, './test-case/index.html')
    const infiniteCanvasPath = fileURLToPath(new URL('../src/infinite-canvas', import.meta.url))
    await build({
        root,
        build: {
            outDir: './dist',
            rollupOptions: {
                input: {
                    indexHtml,
                    testCaseIndexHtml
                }
            }
        },
        resolve: {
            alias: {
                'infinite-canvas': infiniteCanvasPath
            }
        }
    })
    const distDir = path.resolve(root, 'dist')
    const testCasesDir = fileURLToPath(new URL('../test-cases/catalog', import.meta.url))
    const testCasesStaticDir = fileURLToPath(new URL('../test-cases/catalog/static', import.meta.url))
    const app = express();
    app.use(text())
    const { api: testBrowserApi, cleanup: cleanupTestBrowserApi } = createBrowserPoolApi();
    app.use(express.static(distDir));
    app.use('/test-cases', express.static(testCasesDir))
    app.use('/static', express.static(testCasesStaticDir))
    app.use('/test-browser', testBrowserApi)
    const server = http.createServer(app);
    connectTestingMessagePorts(server);
    await new Promise<void>(res => {
        server.listen(8080, res);
    })
    return async () => {
        await cleanupTestBrowserApi();
        await new Promise<void>((res) => {
            server.close(() => res())
        })
    }
}