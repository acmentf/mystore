let path = require('path')
let Glob = require('glob');
let ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.resolvePath = function(dir) {
  return path.resolve(__dirname, '..', dir)
}

exports.cssLoaders = function (options) {
  options = options || {}

  let cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    let loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  let output = []
  let loaders = exports.cssLoaders(options)
  for (let extension in loaders) {
    let loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

function getEntryKey(pathname, basename) {
    let dir = pathname.split('/').splice(3).join('/')
    return (dir ? dir + '/' : '') + basename
}
/**
 * 根据目录获取入口
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
exports.getEntry = function (globPath) {
    let entries = {};
    Glob.sync(globPath).forEach(function (entry) {
        let basename = path.basename(entry, path.extname(entry)),
            pathname = path.dirname(entry);
        // js/lib/*.js 不作为入口
        if (!entry.match(/\/js\/(lib|commons)\//)) {
            entries[getEntryKey(pathname, basename)] = pathname + '/' + basename;
        }
    });
    return entries;
}
/**
 * 根据目录获取 Html 入口
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
exports.getEntryHtml = function (globPath, isProduction) {
    let entries = [];
    Glob.sync(globPath).forEach(function (entry) {
        let basename = path.basename(entry, path.extname(entry)),
            pathname = path.dirname(entry),
            // @see https://github.com/kangax/html-minifier#options-quick-reference
            minifyConfig = !isProduction ? '' : {
                removeComments: true,
                // collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true
            };

        entries.push({
            filename: entry.split('/').splice(2).join('/'),
            template: entry,
            chunks: ['bundle-common', getEntryKey(pathname, basename)],
            minify: minifyConfig
        });

    });
    return entries;
}
