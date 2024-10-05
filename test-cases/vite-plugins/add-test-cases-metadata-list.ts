import { PluginOption } from 'vite'
import { getTestCasesMetadata } from '../backend/get-test-cases-metadata'

export function addTestCasesMetadataList(): PluginOption{
    return {
        name: 'vite-plugin-add-test-cases-metadata',
        resolveId(id: string){
            if(/^virtual:test-cases-metadata-\d-\d$/.test(id)){
                return '\0' + id;
            }
        },
        async load(id: string){
            const match = id ? id.match(/virtual:test-cases-metadata-(\d)-(\d)$/) : null;
            if(!match){
                return;
            }
            const mod = parseInt(match[1]);
            const eq = parseInt(match[2]);
            const metadata = (await getTestCasesMetadata()).filter((_, i) => i % mod === eq);
            return `const a=[${metadata.map(m => JSON.stringify(m)).join(',')}];export default a;`
        }
    }
}