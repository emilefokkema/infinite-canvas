const buildScriptFile = require('./build-script-file');

module.exports = function({source, destination, fileNames}){
    const runnables = fileNames.map(fileName => buildScriptFile({source, destination, fileName}));
    return {
        run(watch, forProduction){
            return Promise.all(runnables.map(r => r.run(watch, forProduction)));
        }
    };
}