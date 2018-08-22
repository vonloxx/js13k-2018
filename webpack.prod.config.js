/* eslint-disable */
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = merge(common, {
  module: {
    rules: [
      { test: /\.js$/, enforce: 'pre', exclude: /(node_modules|\.spec\.js)/, use: ['webpack-strip-block']},
    ]
  },
  plugins: [
    new ZipPlugin({
      path: '../package',
      exclude: [/\.map$/],
      filename: 'game.zip',
    }),
  ],
  mode: 'production',
});
