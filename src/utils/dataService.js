/**
 * 数据服务工具类
 * 实现API优先、虚拟数据fallback的统一策略
 */

class DataService {
  constructor() {
    this.enableLogging = process.env.NODE_ENV === 'development'
  }

  /**
   * 通用数据获取方法
   * @param {Object} options 配置选项
   * @param {Function} options.apiCall API调用函数
   * @param {Function} options.mockDataGenerator 虚拟数据生成函数
   * @param {string} options.dataType 数据类型描述
   * @param {Object} options.params 请求参数
   * @returns {Promise} 返回数据
   */
  async fetchData({ apiCall, mockDataGenerator, dataType = '数据', params = {} }) {
    let data = []
    let useApiData = false

    try {
      // 尝试从API获取数据
      if (apiCall && typeof apiCall === 'function') {
        try {
          const apiData = await apiCall(params)
          
          // 检查API返回的数据是否有效
          if (this.isValidData(apiData)) {
            data = apiData
            useApiData = true
            this.log(`✅ 使用API数据 - ${dataType}:`, Array.isArray(data) ? `${data.length}条记录` : '数据获取成功')
          } else {
            this.log(`⚠️ API返回空数据 - ${dataType}`)
          }
        } catch (apiError) {
          this.log(`❌ API请求失败，使用虚拟数据 - ${dataType}:`, apiError.message)
        }
      }

      // 如果API没有数据或请求失败，使用虚拟数据
      if (!useApiData && mockDataGenerator && typeof mockDataGenerator === 'function') {
        data = mockDataGenerator(params)
        this.log(`🔄 使用虚拟数据 - ${dataType}:`, Array.isArray(data) ? `${data.length}条记录` : '虚拟数据生成成功')
      }

      return data
    } catch (error) {
      this.log(`🆘 数据获取失败 - ${dataType}:`, error.message)
      
      // 最后的fallback，尝试生成虚拟数据
      if (mockDataGenerator && typeof mockDataGenerator === 'function') {
        try {
          const fallbackData = mockDataGenerator(params)
          this.log(`🆘 使用fallback虚拟数据 - ${dataType}:`, Array.isArray(fallbackData) ? `${fallbackData.length}条记录` : 'fallback数据生成成功')
          return fallbackData
        } catch (mockError) {
          this.log(`💥 虚拟数据生成失败 - ${dataType}:`, mockError.message)
        }
      }
      
      return []
    }
  }

  /**
   * 检查数据是否有效
   * @param {*} data 要检查的数据
   * @returns {boolean} 数据是否有效
   */
  isValidData(data) {
    if (data === null || data === undefined) {
      return false
    }
    
    if (Array.isArray(data)) {
      return data.length > 0
    }
    
    if (typeof data === 'object') {
      return Object.keys(data).length > 0
    }
    
    return true
  }

  /**
   * 日志输出
   * @param {string} message 日志消息
   * @param {*} data 附加数据
   */
  log(message, data = '') {
    if (this.enableLogging) {
      console.log(`[DataService] ${message}`, data)
    }
  }

  /**
   * 创建专家数据获取器
   * @param {Object} mockDataMap 虚拟数据映射
   * @returns {Function} 专家数据获取函数
   */
  createExpertsFetcher(mockDataMap = {}) {
    return async (params) => {
      const { getExperts } = await import('@/api/home')
      
      return this.fetchData({
        apiCall: getExperts,
        mockDataGenerator: (params) => {
          const { lotteryType, period } = params
          // 支持两级数据结构：彩种 -> 期数 -> 专家列表
          if (mockDataMap[lotteryType]) {
            if (typeof mockDataMap[lotteryType] === 'object' && !Array.isArray(mockDataMap[lotteryType])) {
              // 新的两级结构
              return mockDataMap[lotteryType][period] || []
            } else {
              // 兼容旧的一级结构
              return mockDataMap[lotteryType] || []
            }
          }
          return []
        },
        dataType: `专家列表-${params.lotteryType || '未知彩种'}-${params.period || '未知期数'}`,
        params
      })
    }
  }

  /**
   * 创建开奖结果获取器
   * @param {Object} mockDataMap 虚拟数据映射
   * @returns {Function} 开奖结果获取函数
   */
  createLotteryResultsFetcher(mockDataMap = {}) {
    return async (params) => {
      const { getLotteryResults } = await import('@/api/home')
      
      return this.fetchData({
        apiCall: getLotteryResults,
        mockDataGenerator: (params) => {
          const { lotteryType } = params
          return mockDataMap[lotteryType] || []
        },
        dataType: `开奖结果-${params.lotteryType || '未知彩种'}`,
        params
      })
    }
  }

  /**
   * 创建彩种信息获取器
   * @param {Array} mockData 虚拟数据
   * @returns {Function} 彩种信息获取函数
   */
  createLotteryTypesFetcher(mockData = []) {
    return async () => {
      const { getLotteryTypes } = await import('@/api/home')
      
      return this.fetchData({
        apiCall: getLotteryTypes,
        mockDataGenerator: () => mockData,
        dataType: '彩种信息',
        params: {}
      })
    }
  }
}

// 创建单例实例
const dataService = new DataService()

export default dataService