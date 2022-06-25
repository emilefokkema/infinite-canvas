const fs = require('fs');
const path = require('path');
const debounce = require('../runtime-utils/debounce');

module.exports = function({source, destination, fileName}){
    return {
        run(watch){
            if(!fs.existsSync(destination)){
                fs.mkdirSync(destination, {recursive: true});
            }
            const fullSource = path.join(source, fileName);
            const fullDestination = path.join(destination, fileName);
            console.log(`copying '${fullSource}' to '${fullDestination}'`)
            fs.copyFileSync(fullSource, fullDestination);
            if(watch){
                fs.watch(fullSource, {}, debounce((eventType, fileName) => {
                    if(eventType === 'change'){
                        console.log(`copying '${fullSource}' to '${fullDestination}'`)
                        fs.copyFileSync(fullSource, fullDestination);
                    }
                }, 50))
            }
        }
    };
}