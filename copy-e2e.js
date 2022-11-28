const fs = require('fs')
const path = require('path')

fs.copyFileSync(path.resolve(__dirname, './dist/infinite-canvas.js'), path.resolve(__dirname, './test/e2e/server/content/infinite-canvas.js'))