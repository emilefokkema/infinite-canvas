import http from 'http'
import fs from 'fs'
import { createServer } from 'vite'
import express from 'express'
import { fileURLToPath } from 'url'
import { createRouter } from './router';
import { PORT } from '../shared/constants';
import { createViteConfig } from '../examples-runner/create-vite-config';

async function run(){
    const app = express();
    const server = http.createServer(app)
    app.use('/api', createRouter())
    const frontendPath = fileURLToPath(new URL('../frontend/dist', import.meta.url))
    if(!fs.existsSync(frontendPath)){
        console.warn(`Directory '${frontendPath}' does not exist. Did you run \`npm run dev-app:build\`?`)
        return;
    }
    app.use(express.static(frontendPath))
    app.use((await createServer(createViteConfig(server))).middlewares)
    
    await new Promise<void>(res => {
        server.listen(PORT, res);
    })
    console.log(`http://localhost:${PORT}`)
}

run();