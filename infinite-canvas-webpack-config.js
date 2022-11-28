module.exports = function(destination, forProduction){
    return {
        entry: './src/main.js',
        module: {
            rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {configFile: 'ts-config.build.json'}
            }
            ]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        output: {
            filename: 'infinite-canvas.js',
            path: destination,
            library: 'InfiniteCanvas',
            libraryTarget: 'umd',
            globalObject: 'this'
        },
        mode: forProduction ? 'production' : 'development'
    };
}