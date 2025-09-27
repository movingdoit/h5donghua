const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true, // 启用ESLint
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('postcss-pxtorem')({
              rootValue: 75, // 基于750px设计稿
              propList: ['*'],
              selectorBlackList: ['.van-', '.ignore-'],
              minPixelValue: 2
            })
          ]
        }
      }
    }
  },
  devServer: {
    host: '0.0.0.0', // 允许外部访问
    port: 8080,
    open: true,
    allowedHosts: 'all', // 允许所有主机访问
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  }
})