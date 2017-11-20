const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const pathsToClean = [
    utils.resolvePath('dist')
]

let entryHtml = utils.getEntryHtml('./src/app/**/*.html', true),
    entryJs = utils.getEntry('./src/app/**/*.js'),
    configPlugins = [
        new CleanWebpackPlugin(pathsToClean, {
            root: utils.resolvePath('')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "bundle-common",
            filename: "bundle-common.[chunkhash].js"
        }),
        new CopyWebpackPlugin([
            {
                context: 'src/assets',
                from:  '**/*',
                to: 'assets',
                toType: 'dir'
            }
        ]),
    ];

// html
entryHtml.forEach(function (v) {
    configPlugins.push(new HtmlWebpackPlugin(v));
});

module.exports = merge(baseWebpackConfig, {
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: utils.resolvePath('dist')
    },
    entry: entryJs,
    devtool: '#source-map',
    plugins: configPlugins,
})