const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

let entryHtml = utils.getEntryHtml('./src/app/**/*.html', true),
    entryJs = utils.getEntry('./src/app/**/*.js'),
    configPlugins = [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        /* new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }), */
        // 手动 copy 一些文件
        // @see https://github.com/kevlened/copy-webpack-plugin
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
    entry: entryJs,
    devtool: '#source-map',
    plugins: configPlugins,
})