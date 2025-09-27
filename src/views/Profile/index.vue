<template>
  <div class="profile">
    <div class="profile-header">
      <div class="avatar">
        <van-image
          src=""
          fit="cover"
          round
          width="80"
          height="80"
        >
          <template v-slot:error>
            <div class="avatar-placeholder">用</div>
          </template>
        </van-image>
      </div>
      <div class="user-info">
        <div class="username">{{ userInfo.username }}</div>
        <div class="user-id">ID: {{ userInfo.userId }}</div>
      </div>
    </div>
    
    <div class="menu-list">
      <van-cell-group>
        <van-cell title="我的关注" is-link />
        <van-cell title="我的收藏" is-link />
        <van-cell title="购买记录" is-link />
        <van-cell title="账户设置" is-link />
        <van-cell title="帮助中心" is-link />
        <van-cell title="关于我们" is-link />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      userInfo: {
        username: '游客用户',
        userId: '123456',
        avatar: ''
      },
      refreshCount: 0,
      loading: false
    }
  },
  mounted() {
    this.setupDataRefreshListener()
    this.loadUserProfile()
  },
  beforeUnmount() {
    this.cleanupDataRefreshListener()
  },
  methods: {
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
      console.log(`Profile页面收到数据刷新请求，原因: ${reason}`)
      
      this.refreshCount++
      this.refreshPageData()
    },
    
    // 处理路由变化
    handleRouteChange(to, from) {
      if (to.name === 'Profile' && from && from.name !== 'Profile') {
        console.log('Profile页面被重新激活，刷新数据')
        this.refreshPageData()
      }
    },
    
    // 刷新页面数据
    refreshPageData() {
      console.log(`Profile页面数据刷新 - 第${this.refreshCount}次`)
      this.loadUserProfile()
    },
    
    // 加载用户资料
    async loadUserProfile() {
      this.loading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟数据更新
        this.userInfo = {
          username: '游客用户',
          userId: Math.floor(Math.random() * 900000 + 100000).toString(),
          avatar: ''
        }
        
        console.log('用户资料加载完成')
      } catch (error) {
        console.error('加载用户资料失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.profile {
  padding: 0.8rem 0.32rem 1rem;
  background: #f7f8fa;
  min-height: 100vh;
}

.profile-header {
  background: white;
  border-radius: 0.16rem;
  padding: 0.48rem;
  margin-bottom: 0.32rem;
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 0.32rem;
}

.avatar-placeholder {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: #ff4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.48rem;
  font-weight: bold;
}

.username {
  font-size: 0.36rem;
  font-weight: bold;
  margin-bottom: 0.08rem;
}

.user-id {
  font-size: 0.24rem;
  color: #666;
}

.menu-list {
  background: white;
  border-radius: 0.16rem;
  overflow: hidden;
}
</style>