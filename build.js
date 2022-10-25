const path = require('path');
const buildWebpack = require('./build-utils/build-webpack');
const infiniteCanvasWebpackConfig = require('./infinite-canvas-webpack-config')(path.resolve(__dirname, 'dist'), true);

buildWebpack(infiniteCanvasWebpackConfig, false).catch((e) => {console.error(e);process.exit(1)});