import {default as fs, type Dirent} from 'fs'

export function getFileContent(path: string): Promise<string>{
    return new Promise<string>((res, rej) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
            if(err){
                rej(err)
                return;
            }
            res(data)
        })
    })
}

export function getDirectoryEntries(path: string): Promise<Dirent[]>{
    return new Promise<Dirent[]>((res, rej) => {
        fs.readdir(path, {withFileTypes: true}, (err, files) => {
            if(err){
                rej(err)
                return;
            }
            res(files)
        })
    })
}