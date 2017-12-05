const path = require('path');
const utils = require('./utils')
const ROOT = process.cwd();  // 根目录
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const CONFIG = require('./build-config')

let entryHtml = utils.getEntryHtml('./src/app/**/*.html'),
    entryJs = utils.getEntry('./src/app/**/*.js'),
    configPlugins = [
        new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify('development'),
				WEBIMHOST: JSON.stringify('' + CONFIG.WEBIMHOST)
			}
		}),
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
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: utils.resolvePath('dist')
    },
    entry: entryJs,
    devtool: '#cheap-module-eval-source-map',
    plugins: configPlugins,
    devServer: {
        contentBase: [
            path.join(ROOT, 'src/')
        ],
        publicPath: '/',
        disableHostCheck: true,
        hot: true,
        stats: 'none',
        host: (function getIPAdress(){
            if (process.env.NODE_ENV !== 'foreign') {
                return 'localhost'
            }
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