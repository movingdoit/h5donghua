import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // 设置相对路径，确保构建后可以直接打开index.html
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 3000,
    open: true,
    cors: true,
    strictPort: false, // 如果端口被占用，自动尝试下一个端口
    hmr: {
      host: '0.0.0.0' // 确保热更新也能在外部访问
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015', // 降低目标版本以提高兼容性
    rollupOptions: {
      output: {
        // 优化文件名，避免特殊字符
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(mp3|wav|ogg|flac|aac)$/i.test(assetInfo.name)) {
            return `assets/audio/[name].[hash].[ext]`
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name].[hash].[ext]`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name].[hash].[ext]`
          }
          return `assets/${ext}/[name].[hash].[ext]`
        }
      }
    },
    // 确保资源内联阈值合适
    assetsInlineLimit: 4096,
    // 确保CSS代码分割
    cssCodeSplit: true
  },
  // 移除SCSS配置，避免构建错误
  css: {
    // 如果没有使用SCSS，注释掉这部分
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: `@import "@/styles/variables.scss";`
    //   }
    // }
  },
  // 确保静态资源正确处理
  publicDir: 'public',
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
})