<template>
  <div class="famous">
    <div class="page-header">
      <h2>名人堂</h2>
      <p>汇聚彩票界顶尖专家</p>
    </div>
    
    <div class="famous-list">
      <div class="famous-item" v-for="expert in famousExperts" :key="expert.id">
        <div class="rank">{{ expert.rank }}</div>
        <div class="avatar">
          <van-image
            :src="expert.avatar"
            fit="cover"
            round
            width="50"
            height="50"
          >
            <template v-slot:error>
              <div class="avatar-placeholder">{{ expert.name.charAt(0) }}</div>
            </template>
          </van-image>
        </div>
        <div class="info">
          <div class="name">{{ expert.name }}</div>
          <div class="stats">
            <span>胜率: {{ expert.winRate }}%</span>
            <span>连中: {{ expert.streak }}期</span>
          </div>
        </div>
        <div class="follow-btn">
          <van-button size="mini" type="primary">关注</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Famous',
  data() {
    return {
      famousExperts: [
        { id: 1, rank: 1, name: '彩神', avatar: '', winRate: 95, streak: 15 },
        { id: 2, rank: 2, name: '预测大师', avatar: '', winRate: 92, streak: 12 },
        { id: 3, rank: 3, name: '号码专家', avatar: '', winRate: 89, streak: 8 }
      ],
      refreshCount: 0,
      loading: false
    }
  },
  mounted() {
    this.setupDataRefreshListener()
    this.loadFamousExperts()
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
      console.log(`Famous页面收到数据刷新请求，原因: ${reason}`)
      
      this.refreshCount++
      this.refreshPageData()
    },
    
    // 处理路由变化
    handleRouteChange(to, from) {
      if (to.name === 'Famous' && from && from.name !== 'Famous') {
        console.log('Famous页面被重新激活，刷新数据')
        this.refreshPageData()
      }
    },
    
    // 刷新页面数据
    refreshPageData() {
      console.log(`Famous页面数据刷新 - 第${this.refreshCount}次`)
      this.loadFamousExperts()
    },
    
    // 加载名人堂数据
    async loadFamousExperts() {
      this.loading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟数据更新（可以添加随机变化）
        this.famousExperts = [
          { 
            id: 1, 
            rank: 1, 
            name: '彩神', 
            avatar: '', 
            winRate: 95 + Math.floor(Math.random() * 3), 
            streak: 15 + Math.floor(Math.random() * 5) 
          },
          { 
            id: 2, 
            rank: 2, 
            name: '预测大师', 
            avatar: '', 
            winRate: 92 + Math.floor(Math.random() * 3), 
            streak: 12 + Math.floor(Math.random() * 5) 
          },
          { 
            id: 3, 
            rank: 3, 
            name: '号码专家', 
            avatar: '', 
            winRate: 89 + Math.floor(Math.random() * 3), 
            streak: 8 + Math.floor(Math.random() * 5) 
          }
        ]
        
        console.log('名人堂数据加载完成')
      } catch (error) {
        console.error('加载名人堂数据失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.famous {
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

.famous-list {
  background: white;
  border-radius: 0.16rem;
  overflow: hidden;
}

.famous-item {
  display: flex;
  align-items: center;
  padding: 0.32rem;
  border-bottom: 1px solid #f0f0f0;
}

.famous-item:last-child {
  border-bottom: none;
}

.rank {
  width: 0.6rem;
  text-align: center;
  font-size: 0.36rem;
  font-weight: bold;
  color: #ff4444;
}

.avatar {
  margin: 0 0.24rem;
}

.avatar-placeholder {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #ff4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.info {
  flex: 1;
}

.name {
  font-size: 0.32rem;
  font-weight: bold;
  margin-bottom: 0.08rem;
}

.stats {
  font-size: 0.24rem;
  color: #666;
}

.stats span {
  margin-right: 0.24rem;
}
</style>