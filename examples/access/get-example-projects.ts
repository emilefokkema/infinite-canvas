import { readdir, readFile } from "fs/promises"
import path from 'path'
import { ExampleProject } from "../shared";
import { ExampleMetadata, getExamplesMetadata } from "./get-examples-metadata";

async function getExampleProject(metadata: ExampleMetadata): Promise<ExampleProject>{
    const filesList: {[name: string]: string} = {};
    const fileNames = (await readdir(metadata.dirPath, {withFileTypes: true}))
        .filter(d => d.isFile())
        .map(d => d.name)
        .filter(n => n !== 'example.json')
    await Promise.all(fileNames.map(addFileToFilesList))
    async function addFileToFilesList(fileName: string): Promise<void>{
        const filePath = path.resolve(metadata.dirPath, fileName);
        const content = await readFile(filePath, {encoding: 'utf8'})
        filesList[fileName] = content;
    }
    return {
        id: metadata.dirName,
        title: metadata.title,
        files: filesList
    }
}

export async function getExampleProjects(dirNames: string[]): Promise<ExampleProject[]>{
    const metadata = await getExamplesMetadata(({dirName}) => dirNames.includes(dirName));
    const result: ExampleProject[] = [];
    await Promise.all(metadata.map(addProjectToResult))
    async function addProjectToResult(metadata: ExampleMetadata): Promise<void>{
        result.push(await getExampleProject(metadata))
    }
    return result;
}