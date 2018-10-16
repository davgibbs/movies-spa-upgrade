/* This is the config for test. It does not minimise code for the bundle or add a hash to the bundle */

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'nosources-source-map',
    output: {
        path: __dirname + '/apps/movies/static/movies/bundles',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [{
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
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 300,
                            name: '[name].[ext]',
                            outputPath: '/fonts/',
                            publicPath: '/static/bundles/fonts/'
                        }
                    }]
                },
                {
                    test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '/fonts/',
                            publicPath: '/static/bundles/fonts/'
                        }
                    }]
                },
        ]
    }
});
