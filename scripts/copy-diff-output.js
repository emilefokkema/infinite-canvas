import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getShortGitStatus } from './short-git-status.js'
import { getChangedPaths } from './changed-paths.js'
import { ensureDirectoryExists } from './ensure-directory-exists.js'
import { getPathAsChildOf } from './path-as-child.js'

const diffOutputDir = fileURLToPath(new URL('../diff-output/', import.meta.url))
const imageSnapshotsDir = fileURLToPath(new URL('../e2e/tests/__image_snapshots__/', import.meta.url))

async function execute(){

    const shortGitStatusOutput = await getShortGitStatus();
    const changedPaths = getChangedPaths(shortGitStatusOutput);
    for(const changedPath of changedPaths){
        const childOfImageSnapshots = getPathAsChildOf(changedPath, [imageSnapshotsDir]);
        if(!childOfImageSnapshots || path.basename(childOfImageSnapshots.path) !== '__diff_output__'){
            continue;
        }
        const relative = path.relative(childOfImageSnapshots.parent, path.resolve(childOfImageSnapshots.path, '..'));
        const destination = path.resolve(diffOutputDir, relative);
        await ensureDirectoryExists(destination)
        await fs.cp(childOfImageSnapshots.path, destination, {recursive: true})
        console.log(`copied '${childOfImageSnapshots.path}' to '${destination}'`)
    }
}

execute();
