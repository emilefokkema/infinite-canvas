const { fork } = require('child_process')
const once = require('./once');

module.exports = function(modulePath, args){
    let childProcess;
    const initialization = new Promise((res, rej) => {
        res = once(res);
        rej = once(rej);
        childProcess = fork(modulePath, args, {
            stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ],
            serialization: 'advanced'
        });
        childProcess.stdout.on('data', (data) => {
            console.log(data.toString())
        });
        childProcess.stderr.on('data', (data) => {
            console.log(data.toString())
        });
        childProcess.on('error', (err) => {
            console.log('child process error')
            rej(err);
        })
        childProcess.on('exit', (code, signal) => {
            if(code === 0){
                return res();
            }
            rej();
        });
        childProcess.on('message', (message) => {
            if(message.initialized){
                res();
            }
        });
    });
    return { childProcess, initialization };
}