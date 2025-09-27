<template>
  <div class="friends">
    <div class="page-header">
      <h2>彩友圈</h2>
      <p>与彩友分享心得体会</p>
    </div>
    
    <div class="post-list">
      <div class="post-item" v-for="post in posts" :key="post.id">
        <div class="post-header">
          <div class="user-info">
            <van-image
              :src="post.avatar"
              fit="cover"
              round
              width="40"
              height="40"
            >
              <template v-slot:error>
                <div class="avatar-placeholder">{{ post.username.charAt(0) }}</div>
              </template>
            </van-image>
            <div class="user-details">
              <div class="username">{{ post.username }}</div>
              <div class="time">{{ post.time }}</div>
            </div>
          </div>
        </div>
        <div class="post-content">{{ post.content }}</div>
        <div class="post-actions">
          <span class="like">👍 {{ post.likes }}</span>
          <span class="comment">💬 {{ post.comments }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Friends',
  data() {
    return {
      posts: [
        {
          id: 1,
          username: '彩友小王',
          avatar: '',
          time: '2小时前',
          content: '今天的七星彩分析，看好这组号码...',
          likes: 15,
          comments: 8
        },
        {
          id: 2,
          username: '预测达人',
          avatar: '',
          time: '4小时前',
          content: '排列五走势分析，大家觉得怎么样？',
          likes: 23,
          comments: 12
        }
      ],
      refreshCount: 0,
      loading: false
    }
  },
  mounted() {
    this.setupDataRefreshListener()
    this.loadPosts()
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
      console.log(`Friends页面收到数据刷新请求，原因: ${reason}`)
      
      this.refreshCount++
      this.refreshPageData()
    },
    
    // 处理路由变化
    handleRouteChange(to, from) {
      if (to.name === 'Friends' && from && from.name !== 'Friends') {
        console.log('Friends页面被重新激活，刷新数据')
        this.refreshPageData()
      }
    },
    
    // 刷新页面数据
    refreshPageData() {
      console.log(`Friends页面数据刷新 - 第${this.refreshCount}次`)
      this.loadPosts()
    },
    
    // 加载帖子数据
    async loadPosts() {
      this.loading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟数据更新
        this.posts = [
          {
            id: 1,
            username: '彩友小王',
            avatar: '',
            time: this.getRandomTime(),
            content: '今天的七星彩分析，看好这组号码...',
            likes: 15 + Math.floor(Math.random() * 10),
            comments: 8 + Math.floor(Math.random() * 5)
          },
          {
            id: 2,
            username: '预测达人',
            avatar: '',
            time: this.getRandomTime(),
            content: '排列五走势分析，大家觉得怎么样？',
            likes: 23 + Math.floor(Math.random() * 10),
            comments: 12 + Math.floor(Math.random() * 5)
          }
        ]
        
        console.log('彩友圈数据加载完成')
      } catch (error) {
        console.error('加载彩友圈数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取随机时间
    getRandomTime() {
      const times = ['1小时前', '2小时前', '3小时前', '4小时前', '5小时前']
      return times[Math.floor(Math.random() * times.length)]
    }
  }
}
</script>

<style scoped>
.friends {
  padding: 0.8rem 0.32rem 1rem;
  background: #f7f8fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 0.48rem;
}

.page-header h2 {
  font-size: 0.48rem;
  margin-bottom: 0.16rem;
}

.page-header p {
  color: #666;
  font-size: 0.28rem;
}

.post-list {
  background: white;
  border-radius: 0.16rem;
  overflow: hidden;
}

.post-item {
  padding: 0.32rem;
  border-bottom: 1px solid #f0f0f0;
}

.post-item:last-child {
  border-bottom: none;
}

.post-header {
  margin-bottom: 0.24rem;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-left: 0.24rem;
}

.username {
  font-size: 0.28rem;
  font-weight: bold;
}

.time {
  font-size: 0.24rem;
  color: #999;
}

.avatar-placeholder {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: #ff4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.post-content {
  font-size: 0.28rem;
  line-height: 1.5;
  margin-bottom: 0.24rem;
}

.post-actions {
  display: flex;
  gap: 0.32rem;
  font-size: 0.24rem;
  color: #666;
}
</style>