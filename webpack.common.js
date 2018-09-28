const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname + '/apps/movies/static/movies',
    entry: {
        app: './js/app.js',
        //vendor: ['bootstrap', 'angular', 'angular-ui-router', 'angular-ui-bootstrap']
    },
    output: {
        path: __dirname + '/apps/movies/static/movies/dist',
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
    optimization: {
     minimize: false
   },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.html$/,
          use: [{
           loader: "html-loader"
          }]
        },
        {
          test: /.*\.(gif|png|jpe?g|svg)$/i,
          use: [
              {
                loader: "file-loader",
                options: {
                  name: '[name].[ext]',
                  outputPath: '/images/',
                  publicPath: '/images/'
                }
              }
          ]
        }
      ]
    }
};
