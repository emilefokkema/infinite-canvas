const copyFile = require('./copy-file');

module.exports = function({source, destination, fileNames}){
    const runnables = fileNames.map(fileName => copyFile({source, destination, fileName}));
    return {
        run(watch){
            for(let runnable of runnables){
                runnable.run(watch);
            }
        }
    };
}