import fs from 'fs/promises'

async function exists(path){
    try{
        await fs.access(path);
        return true
    }catch{
        return false;
    }
}

export async function ensureDirectoryExists(directoryPath){
    if(!(await exists(directoryPath))){
        await fs.mkdir(directoryPath, {recursive: true})
    }
}