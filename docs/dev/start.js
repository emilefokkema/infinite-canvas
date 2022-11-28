const path = require('path')
const fs = require('fs')
const os = require('os')
const WebSocketServer = require('ws');
const http = require('http');
const webpack = require('webpack');
const express = require('express')
const contentDir = path.resolve(__dirname, '..');

const testCaseDir = path.resolve(contentDir, '../test/test-cases')
const webpackConfig = require('../../infinite-canvas-webpack-config')(path.resolve(contentDir, './dev/page'), false);

const portNr = 8080;

class InfiniteCanvasCompilation{
    constructor(){
        this.compiler = webpack(webpackConfig);
        this.resultExists = false;
        this.listeners = [];
        this.started = false;
        this.watching = undefined;
    }
    notifyResult(){
        this.resultExists = true;
        const listenersToNotify = this.listeners.slice();
        for(let listenerToNotify of listenersToNotify){
            listenerToNotify();
        }
    }
    addListener(listener){
        this.listeners.push(listener);
        if(this.resultExists){
            listener();
        }
        if(!this.started){
            this.start();
        }
    }
    removeListener(listener){
        const index = this.listeners.indexOf(listener);
        if(index === -1){
            return;
        }
        this.listeners.splice(index, 1)
        if(this.listeners.length === 0 && this.started){
            this.watching.close(() => {
                console.log('stopped watching')
            })
            this.started = false;
            this.watching = undefined;
            this.resultExists = false;
        }
    }
    start(){
        console.log('beginning to watch')
        this.watching = this.compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
            if(err){
                console.error(err);
            }
            console.log(stats.toString({chunks: false, colors: true}));
            this.notifyResult();
        });
        this.started = true;
    }
}

function readFileContent(path){
    return new Promise((res) => {
        fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
            res(data)
        })
    })
}

async function getUseCaseProjects(){
    const dirNames = await new Promise((res) => {
        fs.readdir(path.resolve(contentDir, './use-cases'), {withFileTypes: true}, (err, dirents) => {
            res(dirents.filter(e => e.isDirectory()).map(e => e.name))
        })
    });
    const result = [];
    await Promise.all(dirNames.map(dirName => addUseCaseToResult(dirName)))
    return result;
    async function addUseCaseToResult(dirName){
        const manifest = JSON.parse(await readFileContent(path.resolve(contentDir, `./use-cases/${dirName}/manifest.json`)));
        result.push({id: `use-cases/${dirName}`, title: manifest.title})
    }
    
}

async function getTestCaseProjects(){
    const fileNames = await new Promise((res) => {
        fs.readdir(testCaseDir, {encoding: 'utf8'}, (err, files) => {
            res(files)
        })
    });
    return fileNames.map(fileName => {
        const withoutExtension = fileName.replace(/\.js$/g,'');
        return {
            id: `test-cases/${withoutExtension}`,
            title: withoutExtension
        };
    })
}

function createApiRouter(){
    const router = express.Router();
    router.get('/projects', async (req, res) => {
        const [useCaseProjects, testCaseProjects] = await Promise.all([
            getUseCaseProjects(),
            getTestCaseProjects()
        ])
        const result = [...useCaseProjects, ...testCaseProjects]
        res.json(result);
    });
    router.get('/projects/defaultProjectId', (req, res) => {
        res.send('use-cases/simple')
    });
    router.get('/test-case/:testCaseId', async (req, res) => {
        const result = await readFileContent(path.resolve(testCaseDir, `${req.params.testCaseId}.js`));
        res.send(result)
    })
    return router;
}

function notifyServerListening(){
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for(let key of Object.keys(interfaces)){
        const ipv4Interfaces = interfaces[key].filter(i => i.family === 'IPv4')
        for(let interface of ipv4Interfaces){
            const hostnameAndPort = `${interface.address}:${portNr}`
            addresses.push(`http://${hostnameAndPort}/dev/page`)
            addresses.push(`https://${hostnameAndPort}/dev/page`)
        }
    }
    console.log(`server is listening at least one of these addresses:`)
    for(let address of addresses){
        console.log(address)
    }
}

function startServer(compilation){
    const webSocketServer = new WebSocketServer.Server({ noServer: true });
    const app = express();
    const static = express.static(contentDir, {maxAge: 3600000});
    app.use(/^(?!\/api)/, static)
    app.use('/api', createApiRouter());
    const server = http.createServer(app);

    server.on('upgrade', (request, socket, head) => {
        webSocketServer.handleUpgrade(request, socket, head, (ws) => {
            const compilationListener = () => {
                ws.send(JSON.stringify({newCompilation: true}))
            };
            compilation.addListener(compilationListener);
            ws.on("close", () => {
                compilation.removeListener(compilationListener);
            });
            ws.onerror = function () {
                compilation.removeListener(compilationListener);
            }
        });
    });
    server.listen(portNr, () => {
        notifyServerListening();
    })
}

async function start(){
    const compilation = new InfiniteCanvasCompilation();
    startServer(compilation);
}

start();