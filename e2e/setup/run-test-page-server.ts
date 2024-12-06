import { default as express } from 'express'
import http from 'http'
import { setupTestPageServer } from './setup-test-page-server';

async function run(): Promise<void>{
    const port = 8080;
    const app = express();
    const server = http.createServer(app);
    await setupTestPageServer(server, app);

    await new Promise<void>(res => {
        server.listen(port, res);
    })
    console.log(`http://localhost:${port}`)
}

run();