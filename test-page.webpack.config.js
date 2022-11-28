const path = require('path');

module.exports = {
    entry: './test/e2e/test-page/page/index.ts',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {configFile: 'ts-config.test-page.json'}
        }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    externalsType: 'self',
    externals: {
        'infinite-canvas': 'InfiniteCanvas'
    },
    output: {
        filename: 'test-page-lib.js',
        path: path.resolve(__dirname, './test/e2e/server/content/test-page/'),
        library: 'TestPageLib',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    mode: 'production'
};