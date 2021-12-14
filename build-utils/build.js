const copyFiles = require('./copy-files');
const buildScriptFiles = require('./build-script-files');
const buildWebpackInChildProcess = require('./build-webpack-in-child-process');

function buildWebpack({config: configFactory}){
    return {
        run(watch, forProduction){
            const config = configFactory(forProduction);
            return buildWebpackInChildProcess(config, watch);
        }
    };
}

function runSteps({steps}){
    return {
        async run(watch, forProduction, build){
            for(let step of steps){
                await build(step, watch, forProduction);
            }
        }
    };
}

function runParallel({parallel}){
    return {
        run(watch, forProduction, build){
            return Promise.all(parallel.map(x => build(x, watch, forProduction)))
        }
    }
}

function makeRunnable(step){
    switch(step.type){
        case 'copyFiles': return copyFiles(step);
        case 'buildScripts': return buildScriptFiles(step);
        case 'webpack': return buildWebpack(step);
        default: return null;
    }
}

async function buildInternal(config, watch, forProduction){
    if(config.steps && Array.isArray(config.steps)){
        return await buildInternal(runSteps(config), watch, forProduction);
    }
    if(config.parallel && Array.isArray(config.parallel)){
        return await buildInternal(runParallel(config), watch, forProduction);
    }
    if(config.run && 'function' === typeof config.run){
        return await config.run(watch, forProduction, buildInternal);
    }
    const runnable = makeRunnable(config);
    if(!runnable){
        return;
    }
    await runnable.run(watch, forProduction);
}

function build(config, watch, forProduction){
    return buildInternal(config, watch, forProduction);
}

module.exports = build;