import { fileURLToPath } from "url";
import { Application, TSConfigReader, type TypeDocOptions } from 'typedoc'

export const outDir = fileURLToPath(new URL('./.temp', import.meta.url));

export async function createApplication(): Promise<Application>{    
    const application = await Application.bootstrapWithPlugins({
        entryPoints: [fileURLToPath(new URL('../../../src/api-surface/infinite-canvas.ts', import.meta.url))],
        entryPointStrategy: 'expand',
        tsconfig: fileURLToPath(new URL('../../../ts-config-types.json', import.meta.url)),
        out: outDir,
        excludeExternals: true,
        hideInPageTOC: true,
        hideBreadcrumbs: true,
        githubPages: false,
        plugin: ['typedoc-plugin-markdown'],
        readme: 'none',
        entryDocument: 'index.md'
    } as Partial<TypeDocOptions>)
    application.options.addReader(new TSConfigReader())
    return application;
}

export async function watchApplication(){
    const application = await createApplication();
    await new Promise<void>((res) => {
        application.convertAndWatch(async (project) => {
            await application.generateDocs(project, outDir);
            res();
        })
    })
}

export async function buildApplication(){
    const app = await createApplication();
    const project = await app.convert();
    if(!project){
        return;
    }
    await app.generateDocs(project, outDir);
}