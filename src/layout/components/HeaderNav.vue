<template>
  <div class="header-nav">
    <div class="nav-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab"
        class="nav-tab"
        :class="{ active: activeTab === tab }"
        @click="setActiveTab(tab)"
      >
        {{ tab }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'HeaderNav',
  data() {
    return {
      tabs: ['推荐', '福彩3D', '排列三'],
      refreshCount: 0
    }
  },
  computed: {
    ...mapGetters('home', ['activeTab'])
  },
  mounted() {
    this.updateTime()
    setInterval(this.updateTime, 60000)
    this.setupDataRefreshListener()
  },
  beforeUnmount() {
    this.cleanupDataRefreshListener()
  },
  methods: {
    ...mapActions('home', ['setActiveTab']),
    updateTime() {
      const now = new Date()
      this.currentTime = now.toTimeString().slice(0, 5)
    },
    
    // 设置数据刷新监听器
    setupDataRefreshListener() {
      // 监听全局数据刷新事件
      window.addEventListener('app-data-refresh', this.handleDataRefresh)
    },
    
    // 清理数据刷新监听器
    cleanupDataRefreshListener() {
      window.removeEventListener('app-data-refresh', this.handleDataRefresh)
    },
    
    // 处理数据刷新
    handleDataRefresh(event) {
      const { reason, timestamp } = event.detail || {}
      console.log(`HeaderNav组件收到数据刷新请求，原因: ${reason}`)
      
      this.refreshCount++
      this.refreshComponentData()
    },
    
    // 刷新组件数据
    refreshComponentData() {
      console.log(`HeaderNav组件数据刷新 - 第${this.refreshCount}次`)
      
      // 更新时间
      this.updateTime()
      
      // 可以在这里添加其他需要刷新的数据
    }
  }
}
</script>

<style lang="scss" scoped>
.header-nav {
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  .nav-tabs {
    display: flex;
    background: white;
    border-bottom: 1px solid #eee;
    padding: 0 0.32rem;
    gap: 0.32rem;
    height: 1rem;
    .nav-tab {
      display: flex;
      flex: 1;
      font-size: 0.32rem;
      color: #666;
      cursor: pointer;
      position: relative;
      justify-content: center;
      align-items: center;
    }

    .nav-tab.active {
      color: #ff4444;
      font-weight: bold;
    }

    .nav-tab.active::after {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 0.6rem;
      bottom: 0;
      height: 0.06rem;
      background: #ff4444;
      border-radius: 0.04rem;
    }
  }
}
</style>