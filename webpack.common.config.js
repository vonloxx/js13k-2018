/* eslint-disable */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = {
  entry: [
    path.join(__dirname, './src/index.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.frag$/, loader: 'raw-loader' },
      { test: /\.vert$/, loader: 'raw-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg|gif)$/, loader: 'file-loader' },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      },
    }),
    new ClosureCompilerPlugin({
      test: /src\/\.js(\?.*)?$/i,
      compiler: {
        // jar: 'path/to/your/custom/compiler.jar', //optional
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'ADVANCED'
      },
      concurrency: 3,
    }),
  ],
};
