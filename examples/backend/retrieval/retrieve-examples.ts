import path from 'path'
import { pathToFileURL } from 'url'
import { getDirectoryEntries, getFileContent } from './utils'
import type { ExampleDescription, ExampleProject } from '../../shared/examples'
import { catalogPath, testCasesPath } from './constants'

export interface ExampleMetadata{
    title: string
    filePaths: {[name: string]: string}
}

export interface ExampleDir{
    id: string
    getIndexHtmlPath(): string
    getMetadata(): Promise<ExampleMetadata>
}

export interface TestCase{
    id: string
    title: string
}

export interface ExampleJson{
    title: string
    files: {[name: string]: string}
}

export interface TestCaseFile{
    id: string
    fileUrl: string
    filePath: string
    getExampleDescription(): Promise<ExampleDescription>
}

class TestCaseFileImpl implements TestCaseFile{
    public fileUrl: string;
    constructor(public id: string, public readonly filePath: string){
        this.fileUrl =  pathToFileURL(filePath).toString();
    }
    public async getExampleDescription(): Promise<ExampleDescription>{
        const imported = await import(this.fileUrl)
        return {
            id: this.id,
            title: imported.default.title,
            kind: 'test-case'
        };
    }
}

class ExampleDirImpl implements ExampleDir{
    constructor(public readonly id: string, private readonly fullPath: string){

    }
    public getIndexHtmlPath(): string{
        return path.resolve(this.fullPath, 'index.html')
    }
    public async getMetadata(): Promise<ExampleMetadata>{
        const exampleJsonPath = path.resolve(this.fullPath, 'example.json');
        const exampleJson = JSON.parse(await getFileContent(exampleJsonPath)) as ExampleJson;
        const filePaths: {[name: string]: string} = {};
        for(let fileName of Object.getOwnPropertyNames(exampleJson.files)){
            filePaths[fileName] = path.resolve(this.fullPath, exampleJson.files[fileName])
        }
        return {title: exampleJson.title, filePaths}
    }
}

export async function findExampleDirs(nameFilter?: (name: string) => boolean): Promise<ExampleDir[]>{
    return (await getDirectoryEntries(catalogPath))
        .filter(e => e.isDirectory() && e.name !== 'app' && (!nameFilter || nameFilter(e.name)))
        .map(e => new ExampleDirImpl(e.name, path.resolve(catalogPath, e.name)))
}

export async function findTestCaseFiles(): Promise<TestCaseFile[]>{
    const entries = (await getDirectoryEntries(testCasesPath)).filter(e => e.isFile()).map(e => e.name);
    return entries.map(fileName => {
        const id = fileName.replace(/\.mjs$/,'');
        const filePath = path.resolve(testCasesPath, fileName);
        return new TestCaseFileImpl(id, filePath);
    })
}

export async function findTestCases(): Promise<ExampleDescription[]>{
    const files = await findTestCaseFiles();
    return await Promise.all(files.map(f => f.getExampleDescription()));
}

export function getExampleDir(dirName: string): ExampleDir{
    const dirPath = path.resolve(catalogPath, dirName);
    return new ExampleDirImpl(dirName, dirPath);
}

async function getProjectFromDir(dir: ExampleDir): Promise<ExampleProject>{
    const metadata = await dir.getMetadata();
    const files: {[name: string]: string} = {};
    await Promise.all(Object.getOwnPropertyNames(metadata.filePaths).map(fileName => addFileContentToResult(fileName)))
    return {id: dir.id, title: metadata.title, files, kind: 'use-case'};

    async function addFileContentToResult(fileName: string): Promise<void>{
        files[fileName] = await getFileContent(metadata.filePaths[fileName])
    }
}

export async function findExampleDescriptions(): Promise<ExampleDescription[]>{
    const [dirs, testCases] = await Promise.all([
        findExampleDirs(),
        findTestCases()
    ])
    const useCases = await Promise.all(dirs.map(getExampleDescriptionFromExampleDir))
    return useCases.concat(testCases);

    async function getExampleDescriptionFromExampleDir(dir: ExampleDir): Promise<ExampleDescription>{
        const metadata = await dir.getMetadata();
        return {id: dir.id, title: metadata.title, kind: 'use-case'};
    }
}

export async function findExamples(ids: string[]): Promise<ExampleProject[]>{
    const dirs = await findExampleDirs(id => ids.includes(id));
    return await Promise.all(dirs.map(dir => getProjectFromDir(dir)))
}