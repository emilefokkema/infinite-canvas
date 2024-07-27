import path from 'path'
import fs from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { CreateExampleRequest } from "../shared";
import { getExamplesDirs } from "./get-examples-dirs";
import { examplesDirPath } from './constants';
import { ExampleMetadata } from './example-metadata';

function createExampleId(title: string, dirs: {dirName: string, fullPath: string}[]): string{
    const wantedId = title.toLowerCase().replace(/[^\w\s]/g,'').replace(/\s+/g,'-');
    let id = wantedId;
    let exists = false, counter = 1;
    while(exists = dirs.some(d => d.dirName === id)){
        id = `${wantedId}-${counter++}`
    }
    return id;
}

export async function createExample(request: CreateExampleRequest): Promise<ExampleMetadata>{
    const dirs = await getExamplesDirs();
    const title = request.title.trim();
    const id = createExampleId(title, dirs);
    const indexHtml = `<canvas id='canvas'></canvas>`;
    const indexJs = `import InfiniteCanvas from 'ef-infinite-canvas';\nimport './index.css';\n\nconst infCanvas = new InfiniteCanvas(document.getElementById('canvas'))`;
    const indexCss = `#canvas{border: 1px solid #000}`;
    const indexDarkCss = `:root{background-color: #333;}`
    const exampleJson = {
        title,
    }
    const exampleDirName = path.resolve(examplesDirPath, id);
    if(!fs.existsSync(exampleDirName)){
        await mkdir(exampleDirName)
    }
    await Promise.all([
        writeFile(path.resolve(exampleDirName, 'index.html'), indexHtml, {encoding: 'utf-8'}),
        writeFile(path.resolve(exampleDirName, 'index.js'), indexJs, {encoding: 'utf-8'}),
        writeFile(path.resolve(exampleDirName, 'index.css'), indexCss, {encoding: 'utf-8'}),
        writeFile(path.resolve(exampleDirName, 'index-dark.css'), indexDarkCss, {encoding: 'utf-8'}),
        writeFile(path.resolve(exampleDirName, 'example.json'), JSON.stringify(exampleJson, null, 2), {encoding: 'utf-8'})
    ])
    return {
        dirName: id,
        dirPath: exampleDirName,
        title,
    };
}