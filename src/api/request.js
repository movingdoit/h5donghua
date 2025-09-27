import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 显示loading
    store.dispatch('setLoading', true)
    
    // 添加token
    const token = store.getters['user/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    store.dispatch('setLoading', false)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    store.dispatch('setLoading', false)
    
    const { code, data, message } = response.data
    
    if (code === 200) {
      return data
    } else {
      // 对于有fallback机制的请求，不显示错误提示
      const config = response.config
      if (config && config.silentError) {
        return Promise.reject(new Error(message || '请求失败'))
      }
      
      Toast.fail(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  error => {
    store.dispatch('setLoading', false)
    
    // 对于有fallback机制的请求，不显示错误提示
    const config = error.config
    if (config && config.silentError) {
      return Promise.reject(error)
    }
    
    if (error.response) {
      const { status } = error.response
      
      switch (status) {
        case 401:
          Toast.fail('登录已过期，请重新登录')
          store.dispatch('user/logout')
          break
        case 403:
          Toast.fail('没有权限访问')
          break
        case 404:
          Toast.fail('请求的资源不存在')
          break
        case 500:
          Toast.fail('服务器内部错误')
          break
        default:
          Toast.fail('网络错误，请稍后重试')
      }
    } else {
      Toast.fail('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

export default service