import { PluginOption } from "vite";
import { getTestCasesMetadata, TestCaseMetadata } from '../backend'

export function addTestCasesList(): PluginOption{
    const virtualModuleId = 'virtual:test-cases-list'
    const resolvedVirtualModuleId = '\0' + virtualModuleId;
    let metadata: TestCaseMetadata[];
    return {
        name: 'vite-plugin-add-test-cases-list',
        async resolveId(id){
            if(id === virtualModuleId){
                return resolvedVirtualModuleId;
            }
            const testCaseMatch = id.match(/^test-cases\/(.*)$/);
            if(!testCaseMatch){
                return;
            }
            if(!metadata){
                metadata = await getTestCasesMetadata();
            }
            return metadata.find(f => f.id === testCaseMatch[1]).fullPath;
        },
        async load(id){
            if(id !== resolvedVirtualModuleId){
                return;
            }
            if(!metadata){
                metadata = await getTestCasesMetadata();
            }
            const varNames = metadata.map(({id}, i) => ({varName: `case${i}`, id}))
            return varNames.map(({varName, id}) => `import ${varName} from 'test-cases/${id}';\n`).join('')
                    + `export default [${varNames.map(({varName, id}) => `{id: '${id}', testCase: ${varName}}`).join(',')}];`
        }
    }
}