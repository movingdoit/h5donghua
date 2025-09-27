<template>
  <div class="master-detail">
    <!-- 返回导航栏 -->
    <div class="back-nav">
      <van-nav-bar
        title="大师详情"
        left-arrow
        @click-left="goBack"
      />
    </div>
    
    <!-- 顶部固定大师信息 -->
    <div class="master-header" :class="{ 'header-fixed': isHeaderFixed }">
      <div class="master-info">
        <div class="master-avatar">
          <van-image
            :src="masterInfo.avatar"
            fit="cover"
            round
            width="80"
            height="80"
          >
            <template v-slot:error>
              <div class="avatar-placeholder">{{ masterInfo.name.charAt(0) }}</div>
            </template>
          </van-image>
        </div>
        
        <div class="master-stats">
          <div class="master-name">{{ masterInfo.name }}</div>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">关注</span>
              <span class="stat-value">{{ masterInfo.followers }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">近10中{{ masterInfo.recent10Hit }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最高连中{{ masterInfo.maxStreak }}</span>
            </div>
          </div>
        </div>
        
        <div class="follow-btn">
          <van-button
            :type="masterInfo.isFollowed ? 'default' : 'danger'"
            size="small"
            :loading="followLoading"
            @click="handleFollow"
          >
            {{ masterInfo.isFollowed ? '已关注' : '关注' }}
          </van-button>
        </div>
      </div>
    </div>

    <!-- 预测记录列表 -->
    <div class="prediction-list" :style="{ paddingTop: isHeaderFixed ? headerHeight + 'px' : '0px' }">
      <div class="list-header">
        <h3>往期预测</h3>
      </div>
      
      <div 
        v-for="prediction in predictions" 
        :key="prediction.id"
        class="prediction-item"
      >
        <div class="prediction-header">
          <div class="period-info">
            <span class="lottery-type">{{ prediction.lotteryType }}</span>
            <span class="period">第{{ prediction.period }}期</span>
          </div>
          <div class="prediction-time">{{ formatTime(prediction.createTime) }}</div>
        </div>
        
        <div class="prediction-content">
          <div class="prediction-numbers">
            <span 
              v-for="number in prediction.numbers" 
              :key="number"
              class="number-ball"
            >
              {{ number }}
            </span>
          </div>
          
          <div class="prediction-result">
            <van-icon 
              v-if="prediction.status === 'win'"
              name="success" 
              color="#4CAF50" 
              size="24"
            />
            <van-icon 
              v-else-if="prediction.status === 'lose'"
              name="close" 
              color="#f44336" 
              size="24"
            />
            <div 
              v-else-if="prediction.status === 'pending'"
              class="countdown-container"
            >
              <div class="countdown-label">开奖倒计时</div>
              <div class="countdown-time">{{ getCountdown(prediction.drawTime) }}</div>
            </div>
          </div>
        </div>
        
        <div v-if="prediction.description" class="prediction-desc">
          {{ prediction.description }}
        </div>
      </div>
      
      <!-- 加载更多 -->
      <div v-if="hasMore" class="load-more" @click="loadMore">
        <van-loading v-if="loading" size="16px" />
        <span v-else>加载更多</span>
      </div>
      
      <div v-else class="no-more">
        没有更多数据了
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'MasterDetail',
  setup() {
    const route = useRoute()
    const masterId = route.params.id
    
    // 响应式数据
    const isHeaderFixed = ref(false)
    const headerHeight = ref(180) // 增加高度以适应导航栏
    const followLoading = ref(false)
    const loading = ref(false)
    const hasMore = ref(true)
    const countdownTimer = ref(null)
    
    // 大师信息
    const masterInfo = reactive({
      id: masterId,
      name: '预测大师',
      avatar: '',
      followers: 1234,
      recent10Hit: 8,
      maxStreak: 15,
      isFollowed: false
    })
    
    // 预测记录 - 初始显示10条数据
    const predictions = ref([
      {
        id: 1,
        lotteryType: '3D',
        period: '2024001',
        numbers: ['1', '2', '3'],
        status: 'pending', // win, lose, pending
        createTime: new Date().getTime() - 3600000,
        drawTime: getTodayDrawTime(),
        description: '三胆：678'
      },
      {
        id: 2,
        lotteryType: '3D',
        period: '2023365',
        numbers: ['4', '5', '6'],
        status: 'win',
        createTime: new Date().getTime() - 86400000,
        drawTime: new Date().getTime() - 3600000,
        description: '五胆：012678'
      },
      {
        id: 3,
        lotteryType: '排3',
        period: '2023364',
        numbers: ['7', '8', '9'],
        status: 'lose',
        createTime: new Date().getTime() - 172800000,
        drawTime: new Date().getTime() - 90000000,
        description: '大号组合，遗憾未中'
      },
      {
        id: 4,
        lotteryType: '3D',
        period: '2023363',
        numbers: ['0', '1', '2'],
        status: 'win',
        createTime: new Date().getTime() - 259200000,
        drawTime: new Date().getTime() - 176400000,
        description: '小号组合，稳定选择'
      },
      {
        id: 5,
        lotteryType: '排3',
        period: '2023362',
        numbers: ['3', '4', '5'],
        status: 'lose',
        createTime: new Date().getTime() - 345600000,
        drawTime: new Date().getTime() - 262800000,
        description: '中号组合，遗憾未中'
      },
      {
        id: 6,
        lotteryType: '3D',
        period: '2023361',
        numbers: ['6', '7', '8'],
        status: 'win',
        createTime: new Date().getTime() - 432000000,
        drawTime: new Date().getTime() - 349200000,
        description: '大号组合，成功命中'
      },
      {
        id: 7,
        lotteryType: '排3',
        period: '2023360',
        numbers: ['9', '0', '1'],
        status: 'win',
        createTime: new Date().getTime() - 518400000,
        drawTime: new Date().getTime() - 435600000,
        description: '跨度组合，精准预测'
      },
      {
        id: 8,
        lotteryType: '3D',
        period: '2023359',
        numbers: ['2', '3', '4'],
        status: 'lose',
        createTime: new Date().getTime() - 604800000,
        drawTime: new Date().getTime() - 522000000,
        description: '连号组合，未能命中'
      },
      {
        id: 9,
        lotteryType: '排3',
        period: '2023358',
        numbers: ['5', '6', '7'],
        status: 'win',
        createTime: new Date().getTime() - 691200000,
        drawTime: new Date().getTime() - 608400000,
        description: '中位数组合，成功预测'
      },
      {
        id: 10,
        lotteryType: '3D',
        period: '2023357',
        numbers: ['8', '9', '0'],
        status: 'win',
        createTime: new Date().getTime() - 777600000,
        drawTime: new Date().getTime() - 694800000,
        description: '循环组合，完美命中'
      }
    ])
    
    // 获取今天21:25的时间戳
    function getTodayDrawTime() {
      const today = new Date()
      const drawTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 25, 0)
      
      // 如果当前时间已过21:25，则设置为明天21:25
      if (new Date() > drawTime) {
        drawTime.setDate(drawTime.getDate() + 1)
      }
      
      return drawTime.getTime()
    }
    
    // 格式化时间
    function formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 3600000) { // 1小时内
        return Math.floor(diff / 60000) + '分钟前'
      } else if (diff < 86400000) { // 24小时内
        return Math.floor(diff / 3600000) + '小时前'
      } else {
        return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
      }
    }
    
    // 获取倒计时
    function getCountdown(drawTime) {
      const now = new Date().getTime()
      const diff = drawTime - now
      
      if (diff <= 0) {
        return '已开奖'
      }
      
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    
    // 处理滚动事件
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      // 当滚动超过大师信息区域的初始位置时，固定头部
      isHeaderFixed.value = scrollTop > 140 // 导航栏高度(92px) + 部分大师信息区域高度
      
      // 检查是否滚动到底部，自动加载更多
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      if (scrollTop + windowHeight >= documentHeight - 100 && hasMore.value && !loading.value) {
        loadMore()
      }
    }
    
    // 关注/取消关注
    async function handleFollow() {
      followLoading.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        masterInfo.isFollowed = !masterInfo.isFollowed
        if (masterInfo.isFollowed) {
          masterInfo.followers++
        } else {
          masterInfo.followers--
        }
      } catch (error) {
        console.error('关注操作失败:', error)
      } finally {
        followLoading.value = false
      }
    }
    
    // 返回上一页
    function goBack() {
      history.back()
    }
    
    // 加载更多
    async function loadMore() {
      if (loading.value) return
      
      loading.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟添加更多数据，每次加载5条
        const newPredictions = []
        for (let i = 0; i < 5; i++) {
          const newId = predictions.value.length + i + 1
          const periodNum = 356 - predictions.value.length - i
          newPredictions.push({
            id: newId,
            lotteryType: Math.random() > 0.5 ? '3D' : '排3',
            period: `2023${periodNum.toString().padStart(3, '0')}`,
            numbers: [
              Math.floor(Math.random() * 10).toString(),
              Math.floor(Math.random() * 10).toString(),
              Math.floor(Math.random() * 10).toString()
            ],
            status: Math.random() > 0.3 ? 'win' : 'lose',
            createTime: new Date().getTime() - (predictions.value.length + i + 1) * 86400000,
            drawTime: new Date().getTime() - (predictions.value.length + i) * 86400000,
            description: '根据历史数据分析得出'
          })
        }
        
        predictions.value.push(...newPredictions)
        
        // 模拟没有更多数据 - 总共最多30条
        if (predictions.value.length >= 30) {
          hasMore.value = false
        }
      } catch (error) {
        console.error('加载更多失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    // 启动倒计时
    function startCountdown() {
      countdownTimer.value = setInterval(() => {
        // 强制更新组件以刷新倒计时显示
        predictions.value = [...predictions.value]
      }, 1000)
    }
    
    // 设置数据刷新监听器
    function setupDataRefreshListener() {
      window.addEventListener('app-data-refresh', handleDataRefresh)
    }
    
    // 清理数据刷新监听器
    function cleanupDataRefreshListener() {
      window.removeEventListener('app-data-refresh', handleDataRefresh)
    }
    
    // 处理数据刷新
    function handleDataRefresh(event) {
      const { reason, timestamp } = event.detail || {}
      console.log(`MasterDetail页面收到数据刷新请求，原因: ${reason}`)
      
      refreshPageData()
    }
    
    // 刷新页面数据
    function refreshPageData() {
      console.log('MasterDetail页面数据刷新')
      
      // 重新加载大师信息
      loadMasterInfo()
      
      // 重新加载预测记录
      loadPredictions()
    }
    
    // 加载大师信息
    async function loadMasterInfo() {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        masterInfo.name = `大师${masterId}`
        masterInfo.avatar = `https://picsum.photos/80/80?random=${masterId}`
        masterInfo.followers = 1234 + Math.floor(Math.random() * 100)
        masterInfo.recent10Hit = 8 + Math.floor(Math.random() * 3)
        masterInfo.maxStreak = 15 + Math.floor(Math.random() * 5)
        
        console.log('大师信息加载完成')
      } catch (error) {
        console.error('加载大师信息失败:', error)
      }
    }
    
    // 加载预测记录
    async function loadPredictions() {
      try {
        loading.value = true
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 重新生成预测记录
        const newPredictions = []
        for (let i = 0; i < 10; i++) {
          const periodNum = 365 - i
          newPredictions.push({
            id: i + 1,
            lotteryType: Math.random() > 0.5 ? '3D' : '排3',
            period: `2024${periodNum.toString().padStart(3, '0')}`,
            numbers: [
              Math.floor(Math.random() * 10).toString(),
              Math.floor(Math.random() * 10).toString(),
              Math.floor(Math.random() * 10).toString()
            ],
            status: i === 0 ? 'pending' : (Math.random() > 0.3 ? 'win' : 'lose'),
            createTime: new Date().getTime() - (i + 1) * 86400000,
            drawTime: i === 0 ? getTodayDrawTime() : new Date().getTime() - i * 86400000,
            description: i === 0 ? '三胆：678' : '根据历史数据分析得出'
          })
        }
        
        predictions.value = newPredictions
        hasMore.value = true
        
        console.log('预测记录加载完成')
      } catch (error) {
        console.error('加载预测记录失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    // 生命周期
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      startCountdown()
      setupDataRefreshListener()
      
      // 初始加载数据
      loadMasterInfo()
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
      }
      cleanupDataRefreshListener()
    })
    
    return {
      isHeaderFixed,
      headerHeight,
      followLoading,
      loading,
      hasMore,
      masterInfo,
      predictions,
      formatTime,
      getCountdown,
      goBack,
      handleFollow,
      loadMore,
      refreshPageData
    }
  }
}
</script>

<style lang="scss" scoped>
.master-detail {
  min-height: 100vh;
  background: #f7f8fa;
}

.back-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: white;
  :deep .van-nav-bar__content{
    height: .825rem;
  }
  :deep(.van-nav-bar) {
    background: white;
    
    .van-nav-bar__title {
      color: var(--text-color);
      font-weight: bold;
      font-size: 0.28rem;
    }
    
    .van-nav-bar__left {
      .van-nav-bar__arrow{
        font-size: 0.5rem !important;
        color: var(--text-secondary);
      }
    }
  }
}

.master-header {
  background: white;
  padding: 0.32rem;
  border-bottom: 1px solid var(--border-color-2);
  transition: all 0.3s ease;
  margin-top: 0.92rem; /* 为返回导航栏留出空间 */
  
  &.header-fixed {
    position: fixed;
    top: 0.92rem; /* 固定在导航栏下方 */
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-bottom: 1px solid var(--border-color-1);
    
    /* 固定时稍微调整内边距 */
    padding: 0.24rem 0.32rem;
    
    .master-info {
      .master-avatar {
        :deep(.van-image) {
          width: 60px !important;
          height: 60px !important;
        }
        
        .avatar-placeholder {
          width: 0.6rem !important;
          height: 0.6rem !important;
          font-size: 0.28rem !important;
        }
      }
      
      .master-name {
        font-size: 0.32rem;
      }
      
      .stats-row {
        .stat-item {
          .stat-label {
            font-size: 0.22rem;
          }
          
          .stat-value {
            font-size: 0.24rem;
          }
        }
      }
    }
    
    .follow-btn button {
      width: 1rem;
      height: 0.56rem;
      font-size: 0.24rem;
    }
  }
}

.master-info {
  display: flex;
  align-items: center;
  gap: 0.24rem;
}

.master-avatar {
  .avatar-placeholder {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.36rem;
  }
}

.master-stats {
  flex: 1;
}

.master-name {
  font-size: 0.36rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 0.16rem;
}

.stats-row {
  display: flex;
  gap: 0.32rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .stat-label {
    font-size: 0.24rem;
    color: var(--text-secondary);
    margin-bottom: 0.08rem;
  }
  
  .stat-value {
    font-size: 0.28rem;
    font-weight: bold;
    color: var(--primary-color);
  }
}

.follow-btn {
  button {
    width: 1.2rem;
    height: 0.64rem;
    font-size: 0.28rem;
  }
}

.prediction-list {
  padding: 0.32rem;
}

.list-header {
  margin-bottom: 0.32rem;
  
  h3 {
    font-size: 0.32rem;
    color: var(--text-color);
    font-weight: bold;
  }
}

.prediction-item {
  background: white;
  border-radius: 0.16rem;
  padding: 0.32rem;
  margin-bottom: 0.24rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.24rem;
}

.period-info {
  display: flex;
  align-items: center;
  gap: 0.16rem;
  
  .lottery-type {
    background: var(--primary-color);
    color: white;
    font-size: 0.24rem;
    padding: 0.08rem 0.16rem;
    border-radius: 0.08rem;
  }
  
  .period {
    font-size: 0.28rem;
    color: var(--text-color);
    font-weight: bold;
  }
}

.prediction-time {
  font-size: 0.24rem;
  color: var(--text-placeholder);
}

.prediction-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.16rem;
}

.prediction-numbers {
  display: flex;
  gap: 0.16rem;
}

.number-ball {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #ff6666);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.32rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(255, 68, 68, 0.3);
}

.prediction-result {
  display: flex;
  align-items: center;
}

.countdown-container {
  text-align: center;
  
  .countdown-label {
    font-size: 0.24rem;
    color: var(--text-secondary);
    margin-bottom: 0.08rem;
  }
  
  .countdown-time {
    font-size: 0.28rem;
    color: var(--primary-color);
    font-weight: bold;
    font-family: 'Courier New', monospace;
  }
}

.prediction-desc {
  font-size: 0.28rem;
  color: var(--text-secondary);
  line-height: 1.4;
  padding-top: 0.16rem;
  border-top: 1px dashed var(--border-color-2);
}

.load-more {
  text-align: center;
  padding: 0.32rem;
  color: var(--primary-color);
  font-size: 0.28rem;
  cursor: pointer;
  
  &:active {
    opacity: 0.7;
  }
}

.no-more {
  text-align: center;
  padding: 0.32rem;
  color: var(--text-placeholder);
  font-size: 0.28rem;
}
</style>