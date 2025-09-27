<template>
  <div 
    class="welcome-container" 
    :class="{ 
      'fade-out': isTransitioning,
      'background-fade-in': showBackgroundAnimation
    }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- 视频播放层 -->
    <div class="video-layer" v-if="showVideo">
      <video 
        ref="welcomeVideo"
        class="welcome-video"
        autoplay
        muted
        playsinline
        @ended="onVideoEnded"
        @loadeddata="onVideoLoaded"
        @error="onVideoError"
      >
        <source src="/video/homevVdeo.mp4" type="video/mp4">
        您的浏览器不支持视频播放。
      </video>
    </div>
    
    <!-- 主要内容 -->
    <div class="content-wrapper" v-if="!showVideo">
      <!-- 向上滑动提示 -->
      <div class="swipe-up-hint" :class="{ 'animate-in': showContent }">
        <div class="swipe-text">向上滑动进入</div>
        <div class="bounce-icon">
          <div class="arrow-down"></div>
        </div>
      </div>
    </div>
    
    <!-- 过渡遮罩 -->
    <div class="transition-overlay" :class="{ 'active': isTransitioning }"></div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      showContent: false,
      isTransitioning: false,
      showVideo: true,
      refreshCount: 0,
      showBackgroundAnimation: false, // 控制背景动画
      hasUserInteracted: false, // 标记用户是否已经交互过
      // 触摸相关
      touchStartY: 0,
      touchEndY: 0,
      minSwipeDistance: 50 // 最小滑动距离
    }
  },
  mounted() {
    this.initPage()
    this.setupDataRefreshListener()
  },
  beforeUnmount() {
    this.cleanupDataRefreshListener()
  },
  methods: {
    // 初始化页面
    initPage() {
      console.log('🎬 Welcome页面初始化，准备播放视频')
      // 确保视频显示
      this.showVideo = true
      this.showContent = false
    },
    
    // 视频加载完成
    onVideoLoaded() {
      console.log('✅ 视频加载完成')
    },
    
    // 视频播放结束
    onVideoEnded() {
      console.log('🎬 视频播放结束，隐藏视频层')
      this.showVideo = false
      this.hasUserInteracted = true // 标记用户已经看完视频
      
      // 立即触发背景动画
      this.showBackgroundAnimation = true
      
      // 延迟显示内容，创建入场动画
      setTimeout(() => {
        this.showContent = true
      }, 800) // 延长到800ms，让背景动画先完成
    },
    
    // 视频播放错误
    onVideoError(error) {
      console.error('❌ 视频播放错误:', error)
      // 如果视频播放失败，直接显示内容
      this.showVideo = false
      
      // 触发背景动画
      this.showBackgroundAnimation = true
      
      setTimeout(() => {
        this.showContent = true
      }, 800)
    },
    
    // 设置数据刷新监听器
    setupDataRefreshListener() {
      // 监听全局数据刷新事件
      window.addEventListener('app-data-refresh', this.handleDataRefresh)
      
      // 监听路由变化
      this.$watch('$route', this.handleRouteChange, { immediate: true })
    },
    
    // 清理数据刷新监听器
    cleanupDataRefreshListener() {
      window.removeEventListener('app-data-refresh', this.handleDataRefresh)
    },
    
    // 处理数据刷新
    handleDataRefresh(event) {
      const { reason, timestamp } = event.detail || {}
      console.log(`Welcome页面收到数据刷新请求，原因: ${reason}`)
      
      this.refreshCount++
      this.refreshPageData()
    },
    
    // 处理路由变化
    handleRouteChange(to, from) {
      // 只有在从其他页面返回到Welcome页面时才刷新数据
      // 排除正在跳转的情况和用户已经交互过的情况
      if (to.name === 'Welcome' && from && from.name !== 'Welcome' && !this.isTransitioning && !this.hasUserInteracted) {
        console.log('Welcome页面被重新激活，刷新数据')
        this.refreshPageData()
      }
    },
    
    // 刷新页面数据
    refreshPageData() {
      console.log(`Welcome页面数据刷新 - 第${this.refreshCount}次`)
      
      // 重置页面状态
      this.showContent = false
      this.isTransitioning = false
      this.showVideo = true
      this.showBackgroundAnimation = false
      this.hasUserInteracted = false // 重置用户交互状态
      
      // 重新初始化页面
      this.$nextTick(() => {
        this.initPage()
      })
    },
    
    enterMain() {
      if (this.isTransitioning) return
      
      this.isTransitioning = true
      
      // 立即跳转，不等待动画完成
      this.$router.push('/home')
    },
    
    // 触摸开始
    onTouchStart(event) {
      if (this.showVideo) return // 视频播放时不处理触摸
      this.touchStartY = event.touches[0].clientY
    },
    
    // 触摸移动
    onTouchMove(event) {
      if (this.showVideo) return // 视频播放时不处理触摸
      event.preventDefault() // 防止页面滚动
    },
    
    // 触摸结束
    onTouchEnd(event) {
      if (this.showVideo) return // 视频播放时不处理触摸
      
      this.touchEndY = event.changedTouches[0].clientY
      const swipeDistance = this.touchStartY - this.touchEndY
      
      // 检查是否为向上滑动且距离足够
      if (swipeDistance > this.minSwipeDistance) {
        console.log('🔄 检测到向上滑动手势，进入Home页面')
        this.enterMain()
      }
    }
  }
}
</script>

<style scoped>
.welcome-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/images/welcomebg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
}

.welcome-container.fade-out {
  transform: scale(0.9);
  opacity: 0.8;
}

/* 背景淡入动画 */
.welcome-container.background-fade-in {
  animation: backgroundFadeIn 0.5s ease-out forwards;
}

@keyframes backgroundFadeIn {
  0% {
    opacity: 1.5; /* 150%透明度 */
    transform: scale(2.0);
  }
  50% {
    opacity: 1.2;
    transform: scale(1.05);
  }
  100% {
    opacity: 1; /* 100%透明度 */
    transform: scale(1);
  }
}

/* 视频播放层 */
.video-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 内容区域 */
.content-wrapper {
  text-align: center;
  color: white;
  z-index: 2;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  bottom: 2rem;
}

/* 向上滑动提示 */
.swipe-up-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.swipe-up-hint.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.swipe-icon {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 12px solid rgba(255, 255, 255, 0.8);
  animation: bounce-up 2s infinite;
}

.arrow-up:nth-child(2) {
  animation-delay: 0.2s;
  opacity: 0.7;
}

.arrow-up:nth-child(3) {
  animation-delay: 0.4s;
  opacity: 0.5;
}

@keyframes bounce-up {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  40% {
    transform: translateY(-10px);
    opacity: 1;
  }
  60% {
    transform: translateY(-5px);
    opacity: 0.8;
  }
}

.swipe-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: pulse-text 3s infinite;
  margin-bottom: 15px;
}

@keyframes pulse-text {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* 底部跳动图标 */
.bounce-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid rgba(255, 255, 255, 0.8);
  animation: bounce-vertical 1.5s ease-in-out infinite;
}

@keyframes bounce-vertical {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-8px);
    opacity: 1;
  }
  50% {
    transform: translateY(0);
    opacity: 0.8;
  }
  75% {
    transform: translateY(8px);
    opacity: 1;
  }
}

.subtitle {
  font-size: 3rem;
  font-weight: 300;
  letter-spacing: 4px;
  margin-bottom: 30px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  color: #999;
}

.subtitle img {
  width: 80%;
}

.subtitle.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 进入按钮 */
.enter-button-wrapper {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.enter-button-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.8s;
}

.enter-button {
  position: relative;
  background: linear-gradient(135deg, #AEC8BF, #567D82);
  border: none;
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: none !important;
  background-color: transparent !important;
}

.enter-button:hover {
  transform: translateY(-2px);
}

.enter-button:active {
  transform: translateY(0);
}

.enter-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.enter-button:active .button-ripple {
  width: 300px;
  height: 300px;
}

/* 过渡遮罩 */
.transition-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.2s ease;
  z-index: 10;
}

.transition-overlay.active {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .subtitle {
    font-size: 16px;
    letter-spacing: 2px;
  }
  
  .enter-button {
    padding: 12px 30px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .subtitle {
    font-size: 14px;
  }
  
  .subtitle img {
    width: 90%;
  }
}
</style>