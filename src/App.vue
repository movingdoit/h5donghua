<template>
  <div id="app">
    <router-view v-slot="{ Component, route }">
      <transition 
        name="page-transition"
        mode="out-in"
        appear
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isPageVisible: true,
      lastVisibilityChange: Date.now()
    }
  },
  mounted() {
    // 设置页面基本配置
    this.setupPage()
    // 监听页面可见性变化
    this.setupVisibilityListener()
  },
  beforeUnmount() {
    // 清理事件监听器
    this.cleanupVisibilityListener()
  },
  methods: {
    setupPage() {
      // 禁用页面缩放
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      }
      
      // 设置页面背景
      document.body.style.margin = '0'
      document.body.style.padding = '0'
      document.body.style.overflow = 'hidden'
    },
    
    // 设置页面可见性监听器
    setupVisibilityListener() {
      // 监听页面可见性变化
      document.addEventListener('visibilitychange', this.handleVisibilityChange)
      
      // 监听页面焦点变化
      window.addEventListener('focus', this.handlePageFocus)
      window.addEventListener('blur', this.handlePageBlur)
      
      // 监听应用从后台恢复（移动端）
      document.addEventListener('resume', this.handleAppResume)
      
      console.log('页面可见性监听器已设置')
    },
    
    // 清理事件监听器
    cleanupVisibilityListener() {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange)
      window.removeEventListener('focus', this.handlePageFocus)
      window.removeEventListener('blur', this.handlePageBlur)
      document.removeEventListener('resume', this.handleAppResume)
    },
    
    // 处理页面可见性变化
    handleVisibilityChange() {
      const isVisible = !document.hidden
      const now = Date.now()
      
      if (isVisible && !this.isPageVisible) {
        // 页面从隐藏变为可见
        const hiddenDuration = now - this.lastVisibilityChange
        console.log(`页面重新可见，隐藏时长: ${Math.round(hiddenDuration / 1000)}秒`)
        
        // 如果隐藏时间超过30秒，触发数据刷新
        if (hiddenDuration > 30000) {
          this.triggerDataRefresh('页面可见性变化')
        }
      }
      
      this.isPageVisible = isVisible
      this.lastVisibilityChange = now
    },
    
    // 处理页面获得焦点
    handlePageFocus() {
      console.log('页面获得焦点')
      this.triggerDataRefresh('页面焦点')
    },
    
    // 处理页面失去焦点
    handlePageBlur() {
      console.log('页面失去焦点')
      this.lastVisibilityChange = Date.now()
    },
    
    // 处理应用从后台恢复
    handleAppResume() {
      console.log('应用从后台恢复')
      this.triggerDataRefresh('应用恢复')
    },
    
    // 触发全局数据刷新
    triggerDataRefresh(reason) {
      console.log(`触发数据刷新，原因: ${reason}`)
      
      // 发送全局事件，通知所有组件刷新数据
      this.$nextTick(() => {
        // 使用事件总线通知所有组件
        if (window.eventBus) {
          window.eventBus.emit('global-data-refresh', { reason, timestamp: Date.now() })
        }
        
        // 也可以通过自定义事件通知
        const refreshEvent = new CustomEvent('app-data-refresh', {
          detail: { reason, timestamp: Date.now() }
        })
        window.dispatchEvent(refreshEvent)
      })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #FDFCFA;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 全局动画类 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

/* 流畅的淡入淡出切换效果 */
.page-transition-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.page-transition-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.page-transition-enter-from {
  opacity: 0;
  transform: scale(0.98) translateY(10px);
  filter: blur(1px);
}

.page-transition-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
  filter: blur(0px);
}

.page-transition-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
  filter: blur(0px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: scale(1.02) translateY(-10px);
  filter: blur(1px);
}

/* 添加平滑的背景过渡 */
.page-transition-enter-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  opacity: 0;
  animation: shimmer 0.4s ease-out forwards;
  pointer-events: none;
  z-index: 1;
}

@keyframes shimmer {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  50% {
    opacity: 0.3;
    transform: translateX(0%);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* 中国风装饰元素 */
.chinese-decoration {
  position: relative;
}

.chinese-decoration::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  border-radius: 2px;
}

.chinese-decoration::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  border-radius: 2px;
}

/* 水墨效果 */
.ink-effect {
  position: relative;
  overflow: hidden;
}

.ink-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 70%, rgba(0,0,0,0.05) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(0,0,0,0.03) 0%, transparent 50%);
  pointer-events: none;
}

/* 节气主题色彩 */
.spring-theme {
  --primary-color: #2ecc71;
  --secondary-color: #a8e6cf;
  --accent-color: #27ae60;
}

.summer-theme {
  --primary-color: #f39c12;
  --secondary-color: #4facfe;
  --accent-color: #e67e22;
}

.autumn-theme {
  --primary-color: #e67e22;
  --secondary-color: #fa709a;
  --accent-color: #d35400;
}

.winter-theme {
  --primary-color: #3498db;
  --secondary-color: #a8edea;
  --accent-color: #2980b9;
}

/* 响应式字体 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px;
  }
}

/* 触摸优化 */
@media (hover: none) and (pointer: coarse) {
  .season-item:hover {
    transform: none;
  }
  
  .season-item:active {
    transform: scale(0.98);
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .season-item {
    border: 2px solid #000;
  }
  
  .back-btn {
    border: 1px solid #000;
  }
}
</style>