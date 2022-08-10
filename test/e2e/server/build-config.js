const path = require('path');
const tempDir = path.join(__dirname, 'content');

module.exports = function(){
    return {
        steps: [
            {
                type: 'copyFiles',
                source: path.resolve(__dirname, '../../../devtools'),
                destination: path.resolve(tempDir, 'test-case'),
                fileNames: ['rhino.jpg']
            },
            {
                type: 'copyFiles',
                source: path.resolve(__dirname, '../../../dist'),
                destination: tempDir,
                fileNames: ['infinite-canvas.js']
            }
        ]
    };
}
