import createDepTrees from './dep-trees.js'

console.log('hello from stackblitz page')

const infCanvasUrl = 'https://cdn.jsdelivr.net/npm/ef-infinite-canvas@0.5.5-alpha/dist/infinite-canvas.js';

const stateType = {
    initializing: 0,
    waitForCompilation: 1,
    watching: 2,
    disconnected: 3,
    switching: 4
}

const pageType = {
    dev: 0,
    embed: 1,
    playground: 2
};

const infiniteCanvasFileName = 'infinite-canvas.js';

class StateDispatcher{
    constructor(){
        this.listeners = [];
        this.state = undefined;
    }
    setState(state){
        this.state = state;
        const listenersToNotify = this.listeners.slice();
        for(let listenerToNotify of listenersToNotify){
            listenerToNotify(state);
        }
    }
    addListener(listener){
        this.listeners.push(listener);
        listener(this.state);
    }
    removeListener(listener){
        const index = this.listeners.indexOf(listener);
        if(index === -1){
            return;
        }
        this.listeners.splice(index, 1)
    }
}

function startWebSocket(onData, onDisconnected){
    const url = new URL(location.href);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(url.toString());
    ws.addEventListener('message', e => {
        const data = JSON.parse(e.data);
        onData(data);
    })
    ws.addEventListener('close', () => {
        console.log('websocket connection closed')
        onDisconnected();
    });
}

function convertJsFile(text, infiniteCanvasReference){
    return text.replace(/import\s*?(\S+)\s*?from\s*?['"]infinite-canvas['"]/g, (m, p1) => `import ${p1} from '${infiniteCanvasReference}'`)
}

async function getTextFromFile(path){
    return await (await fetch(path)).text();
}

async function getJsonFromFile(path){
    return await (await fetch(path)).json();
}

async function getFilesForUseCase(useCaseName){
    const useCaseDirPath = `../../use-cases/${useCaseName}`;
    const manifest = await getJsonFromFile(`${useCaseDirPath}/manifest.json`);
    const result = {files: {}, title: manifest.title};
    await Promise.all(manifest.files.map(fileName => addFileToResult(fileName)));
    return result;
    async function addFileToResult(fileName){
        const path = `${useCaseDirPath}/${fileName}`;
        let text = await getTextFromFile(path);
        result.files[fileName] = text;
    }
}

async function getFilesForTestCase(api, testCaseId){
    const [
        testCaseFileText,
        indexHtmlText,
        indexJsText,
        styleCssText
    ] = await Promise.all([
        api.getTestCaseDefinition(testCaseId),
        getTextFromFile('test-case/index.html'),
        getTextFromFile('test-case/index.js'),
        getTextFromFile('test-case/style.css')
    ]);

    return {
        files: {
            'index.js': indexJsText,
            'index.html': indexHtmlText,
            'style.css': styleCssText,
            'test-case.js': testCaseFileText
        },
        title: 'Test case'
    };
}

function replaceInfiniteCanvasReference(files, infiniteCanvasReference){
    const jsFileNameRegex = /\.js$/;
    const jsFileNames = Object.keys(files.files).filter(n => jsFileNameRegex.test(n));
    for(let jsFileName of jsFileNames){
        files.files[jsFileName] = convertJsFile(files.files[jsFileName], infiniteCanvasReference);
    }
}

async function getFilesForEmbeddedProject(api, projectId){
    const useCaseMatch = projectId.match(/^use-cases\/(.*)$/)
    if(useCaseMatch){
        return await getFilesForUseCase(useCaseMatch[1]);
    }
    const testCaseMatch = projectId.match(/^test-cases\/(.*)$/);
    if(testCaseMatch){
        return await getFilesForTestCase(api, testCaseMatch[1]);
    }
}

class Route{
    setConfig(config, replace){
        const currentConfig = this.getConfig();
        if(config.projectId === currentConfig.projectId && config.type === currentConfig.type){
            return;
        }
        const url = new URL(location.href);
        if(config.type !== pageType.dev){
            url.searchParams.set('type',config.type)
        }
        url.searchParams.set('projectId', config.projectId);
        if(replace){
            history.replaceState({}, '', url.toString());
        }else{
            history.pushState({}, '', url.toString());
        }
    }

    getConfig(){
        const url = new URL(location.href);
        const params = url.searchParams;
        const projectId = params.has('projectId') ? params.get('projectId') : undefined;
        const type = params.has('type') ? parseInt(params.get('type')) : pageType.dev;
        return {
            projectId,
            type
        };
    }
}

class Api{
    async getProjectList(){
        const result = await fetch('../../api/projects');
        return await result.json();
    }
    async getDefaultProjectId(){
        const result = await fetch('../../api/projects/defaultProjectId');
        return await result.text();
    }
    async getTestCaseDefinition(testCaseId){
        const result = await fetch(`../../api/test-case/${testCaseId}`);
        return await result.text();
    }
}

function configureHeader(project, route, api){
    new Vue({
        el: '#dev-bar',
        data: () => {
            return {
                projectId: project.projectId,
                projectState: null
            };
        },
        mounted(){
            project.addStateListener((st) => {
                this.projectState = st;
            })
        },
        computed: {
            selectorDisabled(){
                if(!this.projectState){
                    return false;
                }
                return this.projectState.type === stateType.initializing || this.projectState.type === stateType.switching;
            }
        },
        methods: {
            onProjectIdChanged(value){
                this.projectId = value;
                project.switchToProject(value);
                const config = route.getConfig();
                config.projectId = value;
                route.setConfig(config);
            }
        },
        components: {
            'project-state': {
                template: document.getElementById('projectStateTemplate').innerHTML,
                data: () => ({projectState: null}),
                props: {
                    projectstate: Object
                },
                computed: {
                    message(){
                        if(!this.projectstate){
                            return '';
                        }
                        switch(this.projectstate.type){
                            case stateType.initializing: return 'initializing...'
                            case stateType.waitForCompilation: return 'waiting for compilation...'
                            case stateType.watching: return 'watching'
                            case stateType.disconnected: return 'disconnected'
                            case stateType.switching: return 'switching...'
                            default: return 'state';
                        }
                    }
                }
            },
            'project-selector': {
                template: document.getElementById('projectSelectorTemplate').innerHTML,
                props: {
                    projectid: String,
                    disabled: Boolean
                },
                watch: {
                    projectid(value){
                        this.$emit('projectidchanged', value)
                    }
                },
                data: () => ({options: []}),
                async mounted(){
                    this.options = await api.getProjectList();
                }
            }
        }
    })
}

function hideHeader(){
    document.getElementById('container').classList.remove('dev')
}

function getInfiniteCanvasCompilation(onCompilation, onDisconnected){
    startWebSocket(async (messageData) => {
        if(messageData.newCompilation){
            const infiniteCanvasResponse = await fetch('infinite-canvas.js');
            const infiniteCanvasText = await infiniteCanvasResponse.text();
            onCompilation(infiniteCanvasText);
        }
    }, onDisconnected);
}

async function timeout(fn, timeout){
    return await Promise.race([
        fn(),
        new Promise((res, rej) => setTimeout(() => rej(new Error(`timeout after ${timeout} ms`)), timeout))
    ]);
}

async function retry(fn, interval, maxTimes, onErr){
    let attemptCount = 0;
    while(attemptCount < maxTimes){
        try{
            console.log('performing attempt')
            const result = await fn();
            console.log('attempt succeeded')
            return result;
        }catch(e){
            onErr(attemptCount, e);
            attemptCount++;
            await new Promise(res => setTimeout(res, interval))
        }
    }
}

class EmbeddedProject{
    constructor(api){
        this.api = api;
        this.stateDispatcher = new StateDispatcher();
        this.vm = undefined;
        this.embedPromise = undefined;
        this.projectId = undefined;
        this.infiniteCanvasReference = undefined;
    }
    addStateListener(listener){
        this.stateDispatcher.addListener(listener);
    }
    removeStateListener(listener){
        this.stateDispatcher.removeListener(listener);
    }
    async switchToProject(projectId){
        this.stateDispatcher.setState({type: stateType.switching});
        const [newFiles, currentFiles] = await Promise.all([
            getFilesForEmbeddedProject(this.api, projectId),
            this.vm.getFsSnapshot()
        ])
        replaceInfiniteCanvasReference(newFiles, this.infiniteCanvasReference)
        const newFileNames = Object.keys(newFiles.files)
        const oldFileNames = Object.keys(currentFiles)
        const toDelete = oldFileNames.filter(n => !newFileNames.includes(n) && n !== infiniteCanvasFileName);
        await this.applyFsDiff({
            create: newFiles.files,
            destroy: toDelete
        })
        this.stateDispatcher.setState({type: stateType.watching})
    }
    initialize(projectId, type){
        this.projectId = projectId;
        const watching = type === pageType.dev;
        this.infiniteCanvasReference = watching ? `./${infiniteCanvasFileName}` : 'ef-infinite-canvas';
        this.stateDispatcher.setState({type: stateType.initializing})
        this.embedPromise = this.embedProject(projectId, type);
        if(watching){
            getInfiniteCanvasCompilation(
                (script) => this.addInfiniteCanvas(script),
                () => {
                    this.stateDispatcher.setState({type: stateType.disconnected})
                })
        }
    }
    applyFsDiff(diff){
        return retry(async () => {
            await timeout(async () => {
                console.log('calling applyFsDiff')
                await this.vm.applyFsDiff(diff);
                console.log('applyFsDiff has returned')
            }, 500);
        }, 500, 10, (count, err) => {
            console.warn(`calling applyFsDiff failed at attempt ${count}`, err)
        });
    }
    async addInfiniteCanvas(infiniteCanvasString){
        await this.embedPromise;
        await this.applyFsDiff({
            create: {
                [infiniteCanvasFileName]: infiniteCanvasString
            },
            destroy: []
        })
        this.stateDispatcher.setState({type: stateType.watching})
    }
    getOpenOptions(type, files){
        const fileNames = Object.keys(files.files);
        fileNames.sort((a) => a === 'index.js' ? 1 : -1)
        const openFile = fileNames.join(',')
        if(type === pageType.embed){
            return {
                openFile,
                showSidebar: false,
                hideExplorer: true,
                hideNavigation: true,
                view: 'preview',
                hideDevTools: true,
                theme: 'light'
            }
        }
        return {
            openFile
        };
    }
    async embedProject(projectId, type){
        const watching = type === pageType.dev;
        console.log('calling embedProject')
        const files = await getFilesForEmbeddedProject(this.api, projectId);
        replaceInfiniteCanvasReference(files, this.infiniteCanvasReference)
        console.log('title:', files.title)
        const projectConfig = {
            title: files.title,
            description: 'my cool description',
            template: 'javascript',
            files: files.files
        };
        if(!watching){
            projectConfig.dependencies = {
                "ef-infinite-canvas": "^0.5.5-alpha"
            };
        }
        const openOptions = this.getOpenOptions(type, files);
        this.vm = await StackBlitzSDK.embedProject(
            'embed',
            projectConfig,
            openOptions);
        console.log('embedProject has returned')
        if(watching){
            this.stateDispatcher.setState({type: stateType.waitForCompilation})
        }
    }
}

class ImportDeclaration{
    constructor(ast){
        this.ast = ast;
        // can be stringified with astring.generate(ast)
    }
    replaceSource(url){
        this.ast.source.value = url;
        this.ast.source.raw = `'${url}'`;
    }
    imports(fileName){
        const withoutExtension = fileName.replace(/\.js$/g,'');
        return this.ast.source.value.includes(withoutExtension);
    }
}

class ImportSection{
    constructor(importDeclarations){
        this.importDeclarations = importDeclarations;
    }
    imports(fileName){
        return this.importDeclarations.some(d => d.imports(fileName));
    }
    replaceSources(depUrls){
        for(let depUrl of depUrls){
            const oneThatUsesIt = this.importDeclarations.find(d => d.imports(depUrl.name));
            if(oneThatUsesIt){
                oneThatUsesIt.replaceSource(depUrl.url);
            }
        }
    }
    toString(){
        const program = {
            type: 'Program',
            body: this.importDeclarations.map(d => d.ast)
        };
        return astring.generate(program);
    }
    static create(text){
        const parsed = acorn.parse(text, {ecmaVersion: 2020, sourceType: 'module'});
        const { body: importDeclarations } = parsed;
        return new ImportSection(importDeclarations.filter(d => !/\.css$/.test(d.source.value)).map(d => new ImportDeclaration(d)));
    }
}

class JSFile{
    constructor(name, text){
        this.name = name;
        const importSectionMatch = text.match(/^(?:\s*?import\s*?(?:\S+?\s*?from)?\s*?['"][^'"\s]+['"](?:\s*?;)?|\s*?\/\/.*)+/);
        if(importSectionMatch){
            const sectionText = importSectionMatch[0];
            this.importSection = ImportSection.create(sectionText);
            this.text = text.slice(sectionText.length);
        }else{
            this.text = text;
        }
        this.url = undefined;
    }
    dependsOn(jsFile){
        return !!this.importSection && this.importSection.imports(jsFile.name);
    }
    getUrl(depUrls){
        if(this.url){
            return this.url;
        }
        let text = this.text;
        if(this.importSection){
            this.importSection.replaceSources(depUrls);
            const newImportSection = this.importSection.toString();
            text = newImportSection + text;
        }
        const blob = new Blob([text], {type: 'text/javascript'});
        const url = URL.createObjectURL(blob);
        this.url = url;
        return url;
    }
}

async function createInfiniteCanvasJsFile(){
    let text = await (await fetch(infCanvasUrl)).text();
    text = `const f={};(function(){${text}}).apply(f);const InfiniteCanvas = f.InfiniteCanvas;\nexport default InfiniteCanvas;`;
    return new JSFile('infinite-canvas', text);
}

async function makeEmbed(api, projectId){
    const [
        infCanvasJsFile,
        files
    ] = await Promise.all([
        createInfiniteCanvasJsFile(),
        getFilesForEmbeddedProject(api, projectId)
    ]);
    const otherJsFiles = [];
    const jsFileNames = Object.keys(files.files).filter(n => /\.js$/.test(n));
    for(let jsFileName of jsFileNames){
        const text = files.files[jsFileName];
        const jsFile = new JSFile(jsFileName, text);
        otherJsFiles.push(jsFile);
    }
    const depTrees = createDepTrees([infCanvasJsFile, ...otherJsFiles], (one, other) => one.dependsOn(other));
    const indexJs = depTrees.find(t => t.item.name === 'index.js');
    const result = indexJs.useDependencies((item, depResults) => {
        const url = item.getUrl(depResults)
        return {
            name: item.name,
            url
        }
    });

    const iframe = document.createElement('iframe');
    document.getElementById('embed').appendChild(iframe);
    iframe.contentWindow.document.write(files.files['index.html']);
    const scriptTag = iframe.contentWindow.document.createElement('script');
    scriptTag.setAttribute('type','module');
    scriptTag.setAttribute('src',result.url);
    iframe.contentWindow.document.body.appendChild(scriptTag);
    const cssFileNames = Object.keys(files.files).filter(n => /\.css$/.test(n));
    for(let cssFileName of cssFileNames){
        const url = URL.createObjectURL(new Blob([files.files[cssFileName]], {type: 'text/css'}));
        const styleTag = iframe.contentWindow.document.createElement('link');
        styleTag.setAttribute('rel', 'stylesheet');
        styleTag.setAttribute('type', 'text/css');
        styleTag.setAttribute('href', url);
        iframe.contentWindow.document.head.appendChild(styleTag);
    }
}

async function start(){
    const route = new Route();
    const config = route.getConfig();
    const type = config.type;
    let projectId = config.projectId;
    if(type !== pageType.dev && !projectId){
        return;
    }
    const api = new Api();
    if(type === pageType.embed){
        hideHeader();
        makeEmbed(api, projectId);
        return;
    }
    if(!projectId){
        projectId = await api.getDefaultProjectId();
        config.projectId = projectId;
        route.setConfig(config, true);
    }
    const project = new EmbeddedProject(api);
    project.initialize(projectId, type)
    if(type !== pageType.dev){
       hideHeader();
    }else{
        configureHeader(project, route, api, type);
    }
}

start();