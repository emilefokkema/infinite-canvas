import fs from 'fs/promises'
import { fileURLToPath } from 'url';
import type { PluginOption } from 'vite'

async function getTestCaseByPath(dirUrl: URL, id: string): Promise<{title: string, id: string, dependsOnEnvironments: string[] | undefined, skip?: boolean}>{
    const {default: {title, dependsOnEnvironments, skip}} = await import(new URL(id, dirUrl).toString())
    return {id, title, dependsOnEnvironments, skip};
}

export function resolveTestCases(): PluginOption{

    return {
        name: 'vite-plugin-resolve-test-cases',
        resolveId(id: string){
            if(/^virtual:test-cases-\d$/.test(id)){
                return '\0' + id;
            }
        },
        async load(id: string){
            const match = id ? id.match(/virtual:test-cases-(\d)$/) : null;
            if(!match){
                return;
            }
            const mod = parseInt(match[1]) - 1;
            const testCaseDirUrl = new URL('./test-cases/', import.meta.url);
            const entries = (await fs.readdir(fileURLToPath(testCaseDirUrl), {withFileTypes: true}))
                .filter(e => e.isFile())
                .filter((e, i) => i % 3 === mod)
                .map(e => e.name);
            
            const testCases = await Promise.all(entries.map(e => getTestCaseByPath(testCaseDirUrl, e)))
            return `const a = [${testCases.map(c => JSON.stringify(c)).join(',')}]; export default a;`
        }
    };
}