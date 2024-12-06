import { loadPaths } from '../.vitepress/api-docs/load-paths'

export default {
    async paths(){
        if(process.env.NODE_ENV !== 'production'){
            return [];
        }
        return await loadPaths();
    }
}