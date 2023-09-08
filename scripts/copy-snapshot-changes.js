import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'

const updatedSnapshotsDir = fileURLToPath(new URL('../.updated-snapshots/', import.meta.url))
const snapshotsDir = fileURLToPath(new URL('../test-e2e/__image_snapshots__/', import.meta.url))

async function exists(path){
    try{
        await fs.access(path);
        return true
    }catch{
        return false;
    }
}

async function getChangedOrAddedSnapshotPaths(){
    const commandResult = await new Promise((res, rej) => {
        exec(`git status --short`, (err, stdOut, stdErr) => {
            if(err){
                return rej(err)
            }
            res(stdOut);
        })
    })
    let match;
    const statusEntryRegEx = /[\sM?]{2}\s([^\r\n]*)[\r\n]+/g;
    const result = [];
    while((match = statusEntryRegEx.exec(commandResult)) !== null){
        const changedPath = fileURLToPath(new URL(`../${match[1]}`, import.meta.url))
        if(!path.extname(changedPath)){
            continue;
        }
        const relativeDirName = path.dirname(path.relative(snapshotsDir, changedPath));
        if(relativeDirName !== '.'){
            continue;
        }
        result.push(changedPath)
    }
    return result;
}

async function execute(){
    const changedSnapshotPaths = await getChangedOrAddedSnapshotPaths();
    if(changedSnapshotPaths.length === 0){
        console.log('no snapshots have been changed or added')
        return;
    }
    if(!(await exists(updatedSnapshotsDir))){
        await fs.mkdir(updatedSnapshotsDir, {recursive: true})
    }
    for(let changedSnapshotPath of changedSnapshotPaths){
        const base = path.basename(changedSnapshotPath);
        const destination = path.resolve(updatedSnapshotsDir, base);
        await fs.copyFile(changedSnapshotPath, destination)
        console.log(`wrote updated snapshot to ${destination}`)
    }
}

execute();