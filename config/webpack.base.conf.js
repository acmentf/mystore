const path = require('path');
const webpack = require('webpack');
const ROOT = process.cwd();  // 根目录
const ENV = process.env.NODE_ENV;
const isProduction = ENV === 'production';
const vueLoaderConfig = require('./vue-loader.conf')
const utils = require('./utils');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: (isProduction ? 10 : 4) });

function resolve (dir) {
    // return path.join(__dirname, '..', dir)
    return path.resolve(ROOT, dir)
}

module.exports = {
    // @see https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/master/example/webpack.config.js
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: resolve('dist'),
        // publicPath: '../../'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'happypack/loader?id=vue',
                exclude: /(node_modules|dist)/,
                include: [resolve('src')]
            },
            {
                test: /\.js$/,
                loaders: 'happypack/loader?id=js',
                exclude: /(node_modules|dist)/,
                include: [resolve('src')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[ext]')
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    plugins: [
        new HappyPack({
            id: 'vue',
            threadPool: HappyThreadPool,
            loaders: [
                {
                  loader: 'vue-loader',
                  options: vueLoaderConfig,
                }
            ]
        }),
        new HappyPack({
            id: 'js',
            threadPool: HappyThreadPool,
            loaders: ['babel-loader']
        }),
        new HappyPack({
            id: 'styles',
            threadPool: HappyThreadPool,
            loaders: ['style-loader', 'css-loader', 'sass-loader',  'postcss-loader']
        }),
    ]
};
