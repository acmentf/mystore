/**
 * Created by wyg on 2017/9/30.
 */
module.exports = {
  proxy: {
    '/api': {
      target: 'http://172.17.89.21:30538',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}