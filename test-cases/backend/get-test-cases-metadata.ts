import { Dirent } from 'fs'
import path from 'path'
import { readdir } from 'fs/promises'
import { fileURLToPath, pathToFileURL } from 'url'
import { TestCaseMetadata } from './test-case-metadata'

async function getTestCaseMetadata(fileName: string, fullPath: string): Promise<TestCaseMetadata>{
    const { default: {title, skip}} = await import(pathToFileURL(fullPath).toString())
    const id = fileName.replace(/\.mjs$/, '');
    return {
        id,
        fileName,
        fullPath,
        title,
        skip
    }
}

export async function getTestCasesMetadata(): Promise<TestCaseMetadata[]>{
    const catalogPath = fileURLToPath(new URL('../catalog', import.meta.url))
    const files = (await readdir(catalogPath, {withFileTypes: true})).filter(e => e.isFile())
    const result: TestCaseMetadata[] = []
    await Promise.all(files.map(addResultForFile))
    async function addResultForFile(file: Dirent): Promise<void>{
        const fullPath = path.resolve(catalogPath, file.name)
        result.push(await getTestCaseMetadata(file.name, fullPath))
    }
    result.sort((a, b) => a.id > b.id ? 1 : -1)
    return result;
}