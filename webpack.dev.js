const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: 'http://localhost:3000/static/bundles/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    devServer: {
        contentBase: '',
        port: 3000
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