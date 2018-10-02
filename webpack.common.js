const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname + '/apps/movies/static/movies',
    entry: {
        app: './js/index.js',
        //vendor: ['bootstrap', 'angular', 'angular-ui-router', 'angular-ui-bootstrap']
    },
    output: {
        path: __dirname + '/apps/movies/static/movies/bundles',
        filename: '[name].bundle.js',
        //filename: '[name].[chunkhash].bundle.js'
    },
    plugins: [
        new BundleTracker({filename: './apps/webpack-stats.json'}),
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
        })
    ],
    /*optimization: {
        splitChunks: {
        chunks: "all",
          minSize: 800000
      }
    },*/
//    optimization: {
//     minimize: false
//   },
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
          test: /.*\.(gif|png|jpe?g)$/i,
          use: [
              {
                loader: "file-loader",
                options: {
                  name: '[name].[ext]',
                  outputPath: '/images/',
                  publicPath: '/static/bundles/images/'
                }
              }
          ]
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 400000,
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }
          ]

        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }

          ]
        },
      ]
    }
};
