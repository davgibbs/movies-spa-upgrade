const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    context: __dirname + '/apps/movies/static/movies',
    entry: {
        app: './js/index.js',
    },
    output: {
        path: __dirname + '/apps/movies/static/movies/bundles',
        filename: '[name].[hash].bundle.js',
        chunkFilename: '[name].[chunkhash].bundle.js',
    },
    plugins: [
        new BundleTracker({filename: './apps/webpack-stats.json'}),
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
        }),
        new CleanWebpackPlugin([__dirname + '/apps/movies/static/movies/bundles']),
        new MiniCssExtractPlugin({filename: "[name].css"}),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                 test: /[\\/]node_modules[\\/]/,
                 chunks: 'initial',
                 name: 'vendor',
                },
               }
        }
    },
//    optimization: {
//     minimize: false
//   },
    module: {
      rules: [
        {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  // you can specify a publicPath here
                  // by default it use publicPath in webpackOptions.output
                  publicPath: '/static/bundles/images/'
                }
              },
              "css-loader"
            ]
        },
        {
          test: /\.html$/,
          use: [{
           loader: "html-loader"
          }]
        },
        {
          test: /.*\.(gif|ico|png|jpe?g)$/i,
          use: [{
                loader: "file-loader",
                options: {
                  name: '[name].[ext]',
                  outputPath: '/images/',
                  publicPath: '/static/bundles/images/'
                }
              }]
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 300,
                    name: '[name].[ext]',
                    outputPath: '/fonts/',
                    publicPath: '/static/bundles/fonts/'
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
                    outputPath: '/fonts/',
                    publicPath: '/static/bundles/fonts/'
                }
            }
          ]
        },
      ]
    }
};
