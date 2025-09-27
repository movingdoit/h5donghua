<template>
  <div class="lottery">
    <div class="page-header">
      <h2>开奖信息</h2>
      <p>最新开奖结果查询</p>
    </div>
    
    <div class="lottery-results">
      <div class="result-item" v-for="result in results" :key="result.id">
        <div class="lottery-name">{{ result.name }}</div>
        <div class="period">第{{ result.period }}期</div>
        <div class="numbers">
          <span 
            v-for="number in result.numbers" 
            :key="number"
            class="number"
          >
            {{ number }}
          </span>
        </div>
        <div class="draw-time">{{ result.drawTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lottery',
  data() {
    return {
      results: [
        {
          id: 1,
          name: '七星彩',
          period: '2024001',
          numbers: ['1', '2', '3', '4', '5', '6', '7'],
          drawTime: '2024-01-01 20:30'
        },
        {
          id: 2,
          name: '排列五',
          period: '2024001',
          numbers: ['9', '8', '7', '6', '5'],
          drawTime: '2024-01-01 20:30'
        }
      ],
      refreshCount: 0,
      loading: false
    }
  },
  mounted() {
    this.setupDataRefreshListener()
    this.loadLotteryResults()
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
      console.log(`Lottery页面收到数据刷新请求，原因: ${reason}`)
      
      this.refreshCount++
      this.refreshPageData()
    },
    
    // 处理路由变化
    handleRouteChange(to, from) {
      if (to.name === 'Lottery' && from && from.name !== 'Lottery') {
        console.log('Lottery页面被重新激活，刷新数据')
        this.refreshPageData()
      }
    },
    
    // 刷新页面数据
    refreshPageData() {
      console.log(`Lottery页面数据刷新 - 第${this.refreshCount}次`)
      this.loadLotteryResults()
    },
    
    // 加载开奖结果数据
    async loadLotteryResults() {
      this.loading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟数据更新
        this.results = [
          {
            id: 1,
            name: '七星彩',
            period: this.generatePeriod(),
            numbers: this.generateNumbers(7),
            drawTime: this.getCurrentDateTime()
          },
          {
            id: 2,
            name: '排列五',
            period: this.generatePeriod(),
            numbers: this.generateNumbers(5),
            drawTime: this.getCurrentDateTime()
          }
        ]
        
        console.log('开奖结果数据加载完成')
      } catch (error) {
        console.error('加载开奖结果数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 生成期号
    generatePeriod() {
      const year = new Date().getFullYear()
      const dayOfYear = Math.floor((Date.now() - new Date(year, 0, 0)) / 86400000)
      return `${year}${dayOfYear.toString().padStart(3, '0')}`
    },
    
    // 生成随机号码
    generateNumbers(count) {
      const numbers = []
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * 10).toString())
      }
      return numbers
    },
    
    // 获取当前日期时间
    getCurrentDateTime() {
      const now = new Date()
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} 20:30`
    }
  }
}
</script>

<style scoped>
.lottery {
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

.lottery-results {
  background: white;
  border-radius: 0.16rem;
  overflow: hidden;
}

.result-item {
  padding: 0.32rem;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.lottery-name {
  font-size: 0.32rem;
  font-weight: bold;
  margin-bottom: 0.16rem;
}

.period {
  font-size: 0.24rem;
  color: #666;
  margin-bottom: 0.24rem;
}

.numbers {
  display: flex;
  gap: 0.16rem;
  margin-bottom: 0.24rem;
}

.number {
  width: 0.64rem;
  height: 0.64rem;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.draw-time {
  font-size: 0.24rem;
  color: #999;
}
</style>