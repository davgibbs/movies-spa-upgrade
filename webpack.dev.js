const merge = require('webpack-merge');
var path = require('path');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: 'http://localhost:3000/static/bundles/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Output Management'
      }),
      new BrowserSyncPlugin({
          // browse to http://localhost:3000/ during development,
          // ./public directory is being served
          host: 'localhost',
          port: 4000,
          proxy: 'http://localhost:3000/',
          open: false
          //server: { baseDir: [__dirname + '/apps/movies/static/movies/bundles'] }
        },
//        {
//        // prevent BrowserSync from reloading the page
//        // and let Webpack Dev Server take care of this
//        reload: false
//      }
      )

    ],
    devServer: {
        host: '127.0.0.1',
        contentBase: path.join(__dirname, 'static/bundles/'),
        port: 3000,
        publicPath: '/static/bundles/',
        watchContentBase: true
    },

    module: {
        rules: [{
                test: /.*\.(gif|ico|png|jpe?g)$/i,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/',
                        publicPath: 'http://localhost:3000/static/bundles/images/'
                    }
                }]
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 300,
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: 'fonts/'
                    }
                }]
            },
        ]
    }
});