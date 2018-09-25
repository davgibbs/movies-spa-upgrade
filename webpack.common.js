const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname + '/apps/movies/static/movies',
    entry: {
        app: './js/app.js',
        vendor: ['jquery', 'bootstrap', 'angular', 'angular-ui-router', 'angular-ui-bootstrap', 'angular-utils-pagination']
    },
    output: {
        path: __dirname + '/dist/js',
        filename: '[name].bundle.js'
        //filename: '[name].[chunkhash].bundle.js'
    },
    plugins: [
        new BundleTracker({filename: './webpack-stats.json'})
    ],
    /*optimization: {
        splitChunks: {
        chunks: "all",
          minSize: 800000
      }
    },*/
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
};
