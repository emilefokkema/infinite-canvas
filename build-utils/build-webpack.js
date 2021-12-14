const webpack = require('webpack');

function buildWebpack(config){
    const compiler = webpack(config);
    return new Promise((res, rej) => {
        compiler.run((err, stats) => {
            if(err){
                console.error(err);
                return rej();
            }
            console.log(stats.toString({chunks: false, colors: true}));
            if(stats.hasErrors()){
                return rej();
            }
            res();
        });
    });
}

function watchWebpack(config){
    const compiler = webpack(config);
    let hasInitialized = false;
    return new Promise((res, rej) => {
        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
            if(err){
                console.error(err);
                return rej();
            }
            console.log(stats.toString({chunks: false, colors: true}));
            if(!hasInitialized){
                hasInitialized = true;
                res();
            }
        });
    });
}

module.exports = function(config, watch){
    if(watch){
        return watchWebpack(config);
    }
    return buildWebpack(config);
}