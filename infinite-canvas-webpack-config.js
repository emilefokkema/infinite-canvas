module.exports = function(destination, forProduction){
    return {
        entry: './src/main.js',
        module: {
            rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
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