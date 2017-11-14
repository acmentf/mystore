const path = require('path');
const webpack = require('webpack');
const ROOT = process.cwd();  // 根目录
const ENV = process.env.NODE_ENV;
const isProduction = ENV === 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const vueLoaderConfig = require('./vue-loader.conf')
const utils = require('./utils');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: (isProduction ? 10 : 4) });
const CopyWebpackPlugin = require('copy-webpack-plugin');
const staticUrl = '../../';
const publicPath = (isProduction || ENV === 'dev')? staticUrl : '/';

function resolve (dir) {
    // return path.join(__dirname, '..', dir)
	return path.resolve(ROOT, dir)
}

let entryHtml = utils.getEntryHtml('./src/app/**/*.html'),
	entryJs = utils.getEntry('./src/app/**/*.js'),
	configPlugins = [
		new HappyPack({
			id: 'js',
			// @see https://github.com/amireh/happypack
			threadPool: HappyThreadPool,
			loaders: ['babel-loader']
		}),
		new HappyPack({
			id: 'styles',
			threadPool: HappyThreadPool,
			loaders: ['style-loader', 'css-loader',  'postcss-loader']
		}),
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

// 开发环境不压缩 js
if (isProduction) {
	configPlugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}));
}


// 配置
const config = {
	entry: entryJs,
	// @see https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/master/example/webpack.config.js
	output: {
		filename: 'js/[name].js?[chunkhash:8]',
		chunkFilename: 'js/[name].js?[chunkhash:8]',
		path: resolve('dist'),
		publicPath: publicPath
	},
	module: {
		rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
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
	plugins: configPlugins,
	// @see http://webpack.github.io/docs/webpack-dev-server.html
	// @see http://www.css88.com/doc/webpack2/configuration/dev-server/
	devServer: {
		contentBase: [
			path.join(ROOT, 'src/')
		],
		disableHostCheck: true,  // https://stackoverflow.com/questions/43650550/invalid-host-header-in-when-running-react-app
		hot: false,
		host: '0.0.0.0',
		port: 8080,
        open: true,
        openPage: 'app/login.html',
		/*proxy: {
		  "/m/public": {
		  	target: "http://localhost:8080",
		  	pathRewrite: {
		  		"^/m/public" : ""
		  	}
		  }
		}*/
	}
};

module.exports = config;
