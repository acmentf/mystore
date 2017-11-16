const path = require('path');
const utils = require('./utils')
const ROOT = process.cwd();  // 根目录
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

let entryHtml = utils.getEntryHtml('./src/app/**/*.html'),
    entryJs = utils.getEntry('./src/app/**/*.js'),
    configPlugins = [
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ];

// html
entryHtml.forEach(function (v) {
    configPlugins.push(new HtmlWebpackPlugin(v));
});

module.exports = merge(baseWebpackConfig, {
    entry: entryJs,
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: configPlugins,
    // @see http://webpack.github.io/docs/webpack-dev-server.html
    // @see http://www.css88.com/doc/webpack2/configuration/dev-server/
    devServer: {
        contentBase: [
            path.join(ROOT, 'src/')
        ],
        publicPath: '/',
        disableHostCheck: true,  // https://stackoverflow.com/questions/43650550/invalid-host-header-in-when-running-react-app
        hot: true,
        stats: 'none',
        host: (function getIPAdress(){
            let interfaces = require('os').networkInterfaces();
            for(let devName in interfaces){
                let iface = interfaces[devName];
                for(let i=0;i<iface.length;i++){
                    let alias = iface[i];
                    if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                        return alias.address;
                    }
                }
            }
        })(),
        port: 3001,
        open: true,
        openPage: 'app/login.html',
    }
})