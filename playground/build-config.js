const path = require('path');
const infiniteCanvasWebpackConfig = require('../infinite-canvas-webpack-config');

module.exports = function(destination, excludeInfiniteCanvas){
    const fullDestination = path.resolve(destination);
    const parallel = [
        {
            type: 'copyFiles',
            source: __dirname,
            destination: destination,
            fileNames: ['index.html', 'index.css', 'canvas.html', 'canvas.css', 'dock-bottom.svg', 'dock-right.svg']
        },
        {
            type: 'buildScripts',
            source: __dirname,
            destination: destination,
            fileNames: ['index.js', 'canvas.js']
        }
    ];
    if(!excludeInfiniteCanvas){
        parallel.push({
            type: 'webpack',
            config: (forProduction) => infiniteCanvasWebpackConfig(fullDestination, forProduction)
        });
    }
    return {steps: [{parallel}]};
}