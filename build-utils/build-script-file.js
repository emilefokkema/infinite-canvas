const path = require('path');
const buildWebpackInChildProcess = require('./build-webpack-in-child-process');

module.exports = function({source, destination, fileName}){
    return {
        run(watch, forProduction){
            return buildWebpackInChildProcess({
                entry: path.join(path.resolve(source), fileName),
                output: {
                    filename: fileName,
                    path: path.resolve(destination)
                },
                mode: forProduction ? 'production' : 'development'
            }, watch);
        }
    };
}