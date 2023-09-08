import fs from 'fs/promises'
import path from 'path'
import type { CreateExampleRequest } from '../../shared/examples'
import { findExampleDirs, type ExampleDir, type ExampleJson } from './retrieve-examples'
import { catalogPath } from './constants'

function createExampleId(title: string, dirs: ExampleDir[]): string{
    const wantedId = title.toLowerCase().replace(/[^\w\s]/g,'').replace(/\s+/g,'-');
    let id = wantedId;
    let exists = false, counter = 1;
    while(exists = dirs.some(d => d.id === id)){
        id = `${wantedId}-${counter++}`
    }
    return id;
}

async function exists(path: string): Promise<boolean>{
    try{
        await fs.access(path);
        return true;
    }catch(e){
        return false;
    }
}

export async function addExample(request: CreateExampleRequest): Promise<string>{
    const dirs = await findExampleDirs();
    const title = request.title.trim();
    const id = createExampleId(title, dirs);
    const indexHtml = `<canvas id='canvas'></canvas>`;
    const indexJs = `import InfiniteCanvas from './example-infinite-canvas.js';\nimport './index.css';\n\nconst infCanvas = new InfiniteCanvas(document.getElementById('canvas'))`;
    const indexCss = `#canvas{border: 1px solid #000}`;
    const exampleJson: ExampleJson = {
        title,
        files: {
            'index.html': 'index.html',
            'index.js': 'index.js',
            'index.css': 'index.css',
            'example-infinite-canvas.js': '../example-infinite-canvas.js'
        }
    }
    const exampleDirName = path.resolve(catalogPath, id);
    if(!await exists(exampleDirName)){
        await fs.mkdir(exampleDirName)
    }
    await Promise.all([
        fs.writeFile(path.resolve(exampleDirName, 'index.html'), indexHtml, {encoding: 'utf-8'}),
        fs.writeFile(path.resolve(exampleDirName, 'index.js'), indexJs, {encoding: 'utf-8'}),
        fs.writeFile(path.resolve(exampleDirName, 'index.css'), indexCss, {encoding: 'utf-8'}),
        fs.writeFile(path.resolve(exampleDirName, 'example.json'), JSON.stringify(exampleJson, null, 2), {encoding: 'utf-8'})
    ])
    return id;
}