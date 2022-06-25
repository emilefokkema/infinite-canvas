const yargs = require('yargs');
const buildWebpack = require('./build-webpack');

const argv = yargs.option('-w', {
    alias: 'watch',
    type: 'boolean'
}).argv;

process.on('message', (message) => {
    if(message.config){
        const config = message.config;
        buildWebpack(config, argv.watch).then(() => {
            if(argv.watch){
                if('function' === typeof process.send){
                    process.send({initialized: true})
                }
            }else{
                process.exit(0);
            }
        }, () => process.exit(1));
    }
})
process.send({ready: true});