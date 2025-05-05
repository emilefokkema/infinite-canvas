import { exec } from 'child_process'

export function getShortGitStatus(){
    return new Promise((res, rej) => {
        exec(`git status --short`, (err, stdOut, stdErr) => {
            if(err){
                return rej(err)
            }
            res(stdOut);
        })
    })
}