<template>
  <div class="bottom-nav">
    <div 
      v-for="item in navItems" 
      :key="item.name"
      class="nav-item"
      :class="{ active: $route.name === item.name }"
      @click="navigateTo(item.path)"
    >
      <div class="nav-icon">
        <span v-if="item.badge" class="badge"></span>
        <van-icon 
          :name="item.icon" 
          :color="$route.name === item.name ? '#ff4444' : '#666'"
        />
      </div>
      <div class="nav-text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomNav',
  data() {
    return {
      navItems: [
        {
          name: 'Home',
          path: '/',
          icon: 'wap-home',
          text: '首页',
          badge: false
        },
        {
          name: 'Famous',
          path: '/famous',
          icon: 'fire',
          text: '名人堂',
          badge: false
        },
        // {
        //   name: 'Friends',
        //   path: '/friends',
        //   icon: 'friends-o',
        //   text: '彩友圈',
        //   badge: false
        // },
        {
          name: 'Lottery',
          path: '/lottery',
          icon: 'medal',
          text: '开奖',
          badge: false
        },
        {
          name: 'Profile',
          path: '/profile',
          icon: 'user',
          text: '我',
          badge: true
        }
      ],
      refreshCount: 0
    }
  },
  mounted() {
    this.setupDataRefreshListener()
  },
  beforeUnmount() {
    this.cleanupDataRefreshListener()
  },
  methods: {
    navigateTo(path) {
      try {
        if (this.$route.path !== path) {
          console.log('导航到:', path)
          this.$router.push(path).catch(err => {
            console.error('路由跳转错误:', err)
          })
        }
      } catch (error) {
        console.error('底部导航错误:', error)
      }
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
      console.log(`BottomNav组件收到数据刷新请求，原因: ${reason}`)
      
      this.refreshCount++
      this.refreshComponentData()
    },
    
    // 刷新组件数据
    refreshComponentData() {
      console.log(`BottomNav组件数据刷新 - 第${this.refreshCount}次`)
      
      // 可以在这里更新徽章状态或其他需要刷新的数据
      // 例如：检查是否有新消息，更新徽章显示
      this.updateBadgeStatus()
    },
    
    // 更新徽章状态
    updateBadgeStatus() {
      // 模拟检查是否有新消息或通知
      const hasNewNotification = Math.random() > 0.7
      
      this.navItems.forEach(item => {
        if (item.name === 'Profile') {
          item.badge = hasNewNotification
        }
      })
    }
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1rem;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  z-index: 1000;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  padding: 0.1rem 0;
}

.nav-icon {
  margin-top: 0.1rem;
  line-height: 0;
  font-size: 0.4rem;
  position: relative;
}

.nav-text {
  font-size: 0.28rem;
  color: #666;
}

.nav-item.active .nav-text {
  color: #ff4444;
}

.badge {
  position: absolute;
  top: -0.04rem;
  right: -0.04rem;
  width: 0.12rem;
  height: 0.12rem;
  background: #ff4444;
  border-radius: 50%;
}
</style>