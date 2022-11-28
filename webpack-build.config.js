const path = require('path');
const infiniteCanvasWebpackConfig = require('./infinite-canvas-webpack-config')(path.resolve(__dirname, 'dist'), true);

module.exports = infiniteCanvasWebpackConfig;