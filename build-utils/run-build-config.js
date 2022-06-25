const yargs = require('yargs');
const path = require('path');
const serveFiles = require('./serve-files');
const build = require('./build')

const argv = yargs.option('c', {
    alias: 'config',
    demandOption: true,
    type: 'string'
}).option('s', {
    alias: 'serve',
    demandOption: false, 
    type: 'string'
}).option('d', {
    alias: 'destination',
    demandOption: false, 
    type: 'string'
}).option('w', {
    alias: 'watch',
    demandOption: false, 
    type: 'boolean'
}).option('p', {
    alias: 'production',
    demandOption: false, 
    type: 'boolean'
}).argv;

const config = require(path.relative(__dirname, path.resolve(argv.config)).replace(/\.js$/,''))(argv.destination, argv.production);
build(config, argv.watch, argv.production)
.then(
    () => {
        if(argv.serve){
            const fullPathToServe = path.resolve(argv.serve);
            serveFiles(fullPathToServe);
        }
    },
    (e) => {
        console.log('error', e);
        process.exit(1)
    })
