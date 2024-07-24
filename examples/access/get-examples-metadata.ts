import path from 'path'
import { readFile } from "fs/promises"
import { getExamplesDirs } from "./get-examples-dirs"

export interface ExampleMetadata{
    dirPath: string
    dirName: string
    title: string
}

interface ExampleJson{
    title: string
}

async function getExampleMetadata(dirName: string, dirPath: string): Promise<ExampleMetadata>{
    const exampleJson = JSON.parse(await readFile(path.resolve(dirPath, 'example.json'), {encoding: 'utf-8'})) as ExampleJson;
    return {
        dirPath,
        dirName,
        title: exampleJson.title
    }
}

export async function getExamplesMetadata(filter?: (dir: {dirName: string, fullPath: string}) => boolean): Promise<ExampleMetadata[]>{
    let dirs = await getExamplesDirs();
    if(filter){
        dirs = dirs.filter(filter);
    }
    const result: ExampleMetadata[] = [];
    await Promise.all(dirs.map(({dirName, fullPath}) => addResultForDir(dirName, fullPath)))
    async function addResultForDir(dirName: string, fullPath: string): Promise<void>{
        result.push(await getExampleMetadata(dirName, fullPath))
    }
    return result;
}