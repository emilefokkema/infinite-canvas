const path = require('path');
const runInChildProcess = require('./run-in-child-process');
const modulePath = path.join(__dirname, 'webpack-building-child-process.js');

module.exports = function(config, watch){
    const args = watch ? ['-w'] : [];
    const { childProcess, initialization } = runInChildProcess(modulePath, args);
    childProcess.on('message', (message) => {
        if(message.ready){
            childProcess.send({config});
        }
    });
    return initialization;
}