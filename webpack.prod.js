const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  devtool: 'nosources-source-map',
  /*plugins: [
    new BundleAnalyzerPlugin()
  ]*/
  /*plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: '[name].js.map',
        }),

  ],*/
});
