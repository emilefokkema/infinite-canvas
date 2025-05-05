import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getShortGitStatus } from './short-git-status.js'
import { getChangedPaths } from './changed-paths.js'
import { ensureDirectoryExists } from './ensure-directory-exists.js'
import { getPathAsChildOf } from './path-as-child.js'

const updatedSnapshotsDir = fileURLToPath(new URL('../updated-snapshots/', import.meta.url))
const snapshotsDir = fileURLToPath(new URL('../e2e/tests/__snapshots__/', import.meta.url))
const imageSnapshotsDir = fileURLToPath(new URL('../e2e/tests/__image_snapshots__/', import.meta.url))

async function execute(){
    const shortGitStatusOutput = await getShortGitStatus();
    console.log('git status output is', shortGitStatusOutput)
    const changedPaths = getChangedPaths(shortGitStatusOutput);
    for(const changedPath of changedPaths){
        const childOfSnapshots = getPathAsChildOf(changedPath, [snapshotsDir, imageSnapshotsDir]);
        if(!childOfSnapshots){
            continue;
        }
        const extraPart = childOfSnapshots.parent === snapshotsDir ? 'snapshots' : 'image_snapshots';
        const destination = path.resolve(updatedSnapshotsDir, extraPart, childOfSnapshots.relative);
        await ensureDirectoryExists(path.dirname(destination));
        console.log(`about to copy to '${destination}'...`)
        if(!path.extname(destination)){
            await fs.cp(childOfSnapshots.path, destination, {recursive: true})
            console.log(`wrote updated snapshots to ${destination}`)
        }else{
            await fs.copyFile(childOfSnapshots.path, destination);
            console.log(`wrote updated snapshot to ${destination}`)
        }
       
        

    }
}

execute();