import path from 'path'
import { readdir } from "fs/promises"
import { examplesDirPath } from './constants';

export async function getExamplesDirs(): Promise<{dirName: string, fullPath: string}[]>{
    const dirs = (await readdir(examplesDirPath, {withFileTypes: true})).filter(dir => dir.isDirectory())
    return dirs.map(dir => {
        const fullPath = path.resolve(examplesDirPath, dir.name);
        return {dirName: dir.name, fullPath}
    })
}