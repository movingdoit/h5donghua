<template>
  <div class="layout">
    <!-- 顶部导航 -->
    <HeaderNav v-if="showHeader" />
    
    <!-- 主要内容区域 -->
    <div class="main-content" :class="{ 'no-header': !showHeader }">
      <router-view />
    </div>
    
    <!-- 底部导航 -->
    <BottomNav />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import HeaderNav from './components/HeaderNav.vue'
import BottomNav from './components/BottomNav.vue'

export default {
  name: 'Layout',
  components: {
    HeaderNav,
    BottomNav
  },
  setup() {
    const route = useRoute()
    const refreshCount = ref(0)
    
    // 计算是否显示顶部菜单栏
    const showHeader = computed(() => {
      return route.meta.showHeader !== false // 默认显示，除非明确设置为 false
    })
    
    // 设置数据刷新监听器
    const setupDataRefreshListener = () => {
      window.addEventListener('app-data-refresh', handleDataRefresh)
    }
    
    // 清理数据刷新监听器
    const cleanupDataRefreshListener = () => {
      window.removeEventListener('app-data-refresh', handleDataRefresh)
    }
    
    // 处理数据刷新
    const handleDataRefresh = (event) => {
      const { reason, timestamp } = event.detail || {}
      console.log(`Layout组件收到数据刷新请求，原因: ${reason}`)
      
      refreshCount.value++
      refreshLayoutData()
    }
    
    // 刷新布局数据
    const refreshLayoutData = () => {
      console.log(`Layout组件数据刷新 - 第${refreshCount.value}次`)
      
      // 可以在这里添加布局级别的数据刷新逻辑
      // 例如：更新全局状态、重新获取用户信息等
    }
    
    onMounted(() => {
      setupDataRefreshListener()
    })
    
    onUnmounted(() => {
      cleanupDataRefreshListener()
    })
    
    return {
      showHeader,
      refreshCount
    }
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-top: 1rem; /* 顶部导航高度 */
  padding-bottom: 1rem; /* 底部导航高度 */
  transition: padding-top 0.3s ease; /* 平滑过渡效果 */
}

/* 无顶部菜单栏时的样式 */
.main-content.no-header {
  padding-top: 0; /* 减少顶部间距 */
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>