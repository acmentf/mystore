module.exports = {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001', //目标地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }