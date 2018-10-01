const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'nosources-source-map',
  /*plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: '[name].js.map',
        }),

  ],*/
});
