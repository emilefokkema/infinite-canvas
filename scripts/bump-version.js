import { exec } from 'child_process'
import yargs from 'yargs/yargs';
import path from 'path'
import { fileURLToPath } from 'url';
import { hideBin } from 'yargs/helpers'
import { readFile, writeFile } from 'fs/promises';

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const argv = yargs(hideBin(process.argv))
    .option('patch', {
        alias: 'p',
        type: 'boolean',
        description: 'update patch version'
    })
    .option('minor', {
        alias: 'm',
        type: 'minor',
        description: 'update minor version'
    })
    .check((argv, aliases) => {
        if(!argv.patch && !argv.minor){
            throw new Error('Please specify the version step (patch or minor)')
        }
        return true;
    })
    .argv

function getVersionStep(argv){
    if(argv.patch){
        return 'patch'
    }else if(argv.minor){
        return 'minor'
    }
}

async function runNpmVersion(versionStep){
    const command = `npm version ${versionStep} --git-tag-version=false`
    console.log(`Running '${command}'`)
    const result = await new Promise((res, rej) => {
        exec(command, (err, stdOut, stdErr) => {
            if(err){
                return rej(err)
            }
            res(stdOut);
        })
    })
    return result
}

async function replaceVersionInReadme(newVersionTag, currentFilePath, currentVersion){
    const newVersion = newVersionTag.match(/v(\S+)\s*$/)[1]
    const readmePath = path.resolve(currentFilePath, '../../README.md')
    const readmeContent = await readFile(readmePath, {encoding: 'utf-8'})
    const toReplace = new RegExp(`(ef-infinite-canvas@\\^?)${escapeRegExp(currentVersion)}`, 'g')
    const newReadmeContent = readmeContent.replace(toReplace, `$1${newVersion}`)
    await writeFile(readmePath, newReadmeContent)
    console.log(`Written new content to ${readmePath}`)
}

async function getCurrentVersion(currentFilePath){
    const packageJsonPath = path.resolve(currentFilePath, '../../package.json')
    const packageJsonContent = await readFile(packageJsonPath, {encoding: 'utf-8'})
    const packageJson = JSON.parse(packageJsonContent)
    return packageJson.version;
}

async function run(argv, currentFilePath){
    const currentVersion = await getCurrentVersion(currentFilePath)
    const versionStep = getVersionStep(argv);
    const versionTag = await runNpmVersion(versionStep);
    await replaceVersionInReadme(versionTag, currentFilePath, currentVersion)
    
}

run(argv, fileURLToPath(import.meta.url))

