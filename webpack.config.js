const path = require('path');

module.exports = {
  entry: './src/infinite-canvas.ts',
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
    path: path.resolve(__dirname, 'dist'),
    library: 'infinitecanvas'
  }
};