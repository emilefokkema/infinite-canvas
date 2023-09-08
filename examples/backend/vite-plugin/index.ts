import { fileURLToPath } from 'url'
import path from 'path';
import { build, createServer, type PluginOption, type ViteDevServer } from 'vite'
import { getExampleDir, findExampleDirs, findTestCaseFiles, type TestCaseFile } from '../retrieval/retrieve-examples'

export interface ExamplesOptions{
    external?: ExamplesExternalOptions
}

export interface ExamplesExternalOptions{
    publicPath?: string
}

function buildExamples(): PluginOption{
    return {
        name: 'vite-plugin-infinite-canvas-examples',
        config: async (config, env) => {
            let input: {[entryAlias: string]: string} | undefined = undefined;
            if(env.command === 'build'){
                const exampleDirs = await findExampleDirs();
                for(let exampleDir of exampleDirs){
                    (input || (input = {}))[exampleDir.id] = exampleDir.getIndexHtmlPath();
                }
            }
            return {
                resolve: {
                    alias: {
                        'ef-infinite-canvas': fileURLToPath(new URL('../../../src/infinite-canvas.ts', import.meta.url)),
                        'infinite-canvas': fileURLToPath(new URL('../../../src/infinite-canvas.ts', import.meta.url))
                    }
                },
                build: input ? {
                    rollupOptions: {input}
                } : undefined
            };
        },
        transformIndexHtml: {
            order: 'pre',
            handler: (html: string, ctx) => {
                if(!/\/catalog\/[^/]+\/index.html/.test(ctx.filename)){
                    return;
                }
                return [{tag: 'script', attrs: {'src': 'index.js','type': 'module'}}]
            }
        },
        resolveId: {
            order: 'post',
            handler: async (source: string, importer: string | undefined) => {
                const importerMatch = (importer || '').match(/\/catalog\/([^/]+)\/[^/]+$/)
                if(!importerMatch){
                    return;
                }
                const sourceMatch = source.match(/\.\/(.*)$/);
                if(!sourceMatch){
                    return;
                }
                const [, exampleId] = importerMatch;
                const [,fileName] = sourceMatch;
                const exampleDir = getExampleDir(exampleId);
                const metadata = await exampleDir.getMetadata();
                const result = metadata.filePaths[fileName];
                return result;
            }
        }
    }; 
}

function addExamplesExternal(options: ExamplesExternalOptions): PluginOption{
    let outDir: string | undefined = undefined;
    const otherRoot = fileURLToPath(new URL('../../catalog', import.meta.url))
    let otherServer: ViteDevServer | undefined = undefined;
    let examplesWritten: boolean = false;
    return {
        name: 'vite-plugin-infinite-canvas-examples-external',
        configResolved: (c) => {
            outDir = c.build.outDir;
        },
        configureServer: async (server) => {
            if(!!otherServer){
                return;
            }
            otherServer = await createServer({root: otherRoot, plugins: [buildExamples(), addTestCases()], server: {middlewareMode: true}, base: options.publicPath});
            server.middlewares.use(options.publicPath, otherServer.middlewares);
        },
        writeBundle: async () => {
            if(examplesWritten){
                return;
            }
            const examplesOutDir = path.resolve(outDir, options.publicPath.replace(/^\//,''))
            await build({root: otherRoot, plugins: [buildExamples()], base: options.publicPath, build: {outDir: examplesOutDir, emptyOutDir: false}})
            examplesWritten = true;
            
        }
    };
}

export function addTestCases(): PluginOption{
    const virtualModuleId = 'virtual:test-cases-list'
    const virtualModuleIdRegExp = new RegExp(`${virtualModuleId}$`)
    let testCaseFiles: TestCaseFile[];
    return {
        name: 'vite-plugin-add-test-cases',
        async resolveId(id: string){
            if(id === virtualModuleId){
                return '\0' + virtualModuleId
            }
            const testCaseMatch = id.match(/^test-cases\/(.*)$/)
            if(testCaseMatch){
                await ensureTestCaseFiles();
                const testCaseId = testCaseMatch[1];
                const testCase = testCaseFiles.find(f => f.id === testCaseId);
                return testCase.filePath;
            }
        },
        async load(id: string){
            if(virtualModuleIdRegExp.test(id)){
                await ensureTestCaseFiles();
                const infos = testCaseFiles.map((f, i) => ({varName: `case${i}`, id: f.id}))
                return infos.map(({varName, id}) => `import ${varName} from 'test-cases/${id}';\n`).join('')
                    + `export default [${infos.map(({varName, id}) => `{id: '${id}', ...${varName}}`).join(',')}];`
            }
        }
    };

    async function ensureTestCaseFiles(): Promise<void>{
        if(!!testCaseFiles){
            return;
        }
        testCaseFiles = await findTestCaseFiles();
    }
}

export function addExamples(options?: ExamplesOptions): PluginOption{
    if(options && options.external){
        return addExamplesExternal(options.external);
    }else{
        return buildExamples();
    }
}