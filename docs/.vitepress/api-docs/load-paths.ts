import fs from 'fs/promises';
import path from 'path'
import { outDir, buildApplication } from './create-application';

async function getPathsFromApplication(): Promise<{path: string, content: string}[]>{
    const result: {path: string, content: string}[] = [];
    await addDirectoryToResult(outDir, []);
    return result;

    async function addDirectoryToResult(fullPath: string, dirs: string[]): Promise<void>{
        const promises: Promise<void>[] = [];
        const entries = await fs.readdir(fullPath, {withFileTypes: true});
        for(let entry of entries){
            const entryPath = path.resolve(fullPath, entry.name);
            if(entry.isFile()){
                promises.push(addFileToResult(entryPath, entry.name, dirs));
                continue;
            }
            if(entry.isDirectory()){
                promises.push(addDirectoryToResult(entryPath, dirs.concat([entry.name])))
            }
        }
        await Promise.all(promises);
    }

    async function addFileToResult(filePath: string, fileName: string, dirs: string[]): Promise<void>{
        const content = await fs.readFile(filePath, {encoding: 'utf-8'});
        const fileNameWithoutExtension = fileName.replace(/\.md$/,'')
        const dirPart = dirs.length > 0 ? dirs.join('/') + '/' : '';
        result.push({path: dirPart + fileNameWithoutExtension, content});
    }
}

export interface LoadPathsResult{
    params: {file: string},
    content: string
}

export async function loadPaths(): Promise<LoadPathsResult[]>{
    await buildApplication();
    const result = await getPathsFromApplication();
    return result.map(({path, content}) => ({params: {file: path}, content}))
}