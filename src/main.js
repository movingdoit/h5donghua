import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('应用错误:', err, info)
}

// 全局属性
app.config.globalProperties.$utils = {
  // 格式化日期
  formatDate(date) {
    return new Date(date).toLocaleDateString('zh-CN')
  },
  
  // 防抖函数
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },
  
  // 节流函数
  throttle(func, limit) {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

app.mount('#app')