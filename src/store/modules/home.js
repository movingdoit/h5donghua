const state = {
  activeTab: '推荐',
  lotteryType: 'paisan', // 默认高亮排3
  lotteryTypeDisplay: '排3', // 显示用的中文名称
  periods: ['shiqibang', 'ershiqibang', 'sanshiqibang', 'lianhongbang'],
  periodsDisplay: ['10期榜', '20期榜', '30期榜', '连红榜'],
  activePeriod: 'shiqibang',
  activePeriodDisplay: '10期榜',
  experts: [],
  loading: false
}

const getters = {
  activeTab: state => state.activeTab,
  lotteryType: state => state.lotteryType,
  lotteryTypeDisplay: state => state.lotteryTypeDisplay,
  periods: state => state.periods,
  periodsDisplay: state => state.periodsDisplay,
  activePeriod: state => state.activePeriod,
  activePeriodDisplay: state => state.activePeriodDisplay,
  experts: state => state.experts,
  loading: state => state.loading
}

const mutations = {
  SET_ACTIVE_TAB(state, tab) {
    state.activeTab = tab
  },
  SET_LOTTERY_TYPE(state, { type, display }) {
    state.lotteryType = type
    state.lotteryTypeDisplay = display
  },
  SET_ACTIVE_PERIOD(state, { period, display }) {
    state.activePeriod = period
    state.activePeriodDisplay = display
  },
  SET_EXPERTS(state, experts) {
    state.experts = experts
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  setActiveTab({ commit }, tab) {
    commit('SET_ACTIVE_TAB', tab)
  },
  async setLotteryType({ commit, dispatch }, { type, display }) {
    commit('SET_LOTTERY_TYPE', { type, display })
    // 切换彩种时自动刷新数据
    await dispatch('fetchExperts', type)
  },
  async setActivePeriod({ commit, dispatch }, { period, display }) {
    commit('SET_ACTIVE_PERIOD', { period, display })
    // 切换期数时自动刷新数据
    await dispatch('fetchExperts')
  },
  

  async fetchExperts({ commit, state }, lotteryType = null) {
    commit('SET_LOADING', true)
    
    try {
      // 使用传入的彩种类型或当前状态中的彩种类型
      const currentLotteryType = lotteryType || state.lotteryType
      
      // 导入数据服务和虚拟数据配置
      const [dataService, { MOCK_EXPERTS }] = await Promise.all([
        import('@/utils/dataService'),
        import('@/config/mockData')
      ])
      
      // 创建专家数据获取器
      const expertsFetcher = dataService.default.createExpertsFetcher(MOCK_EXPERTS)
      
      // 获取专家数据
      const experts = await expertsFetcher({
        lotteryType: currentLotteryType,
        period: state.activePeriod
      })
      
      commit('SET_EXPERTS', experts)
    } catch (error) {
      console.error('获取专家数据失败:', error)
      commit('SET_EXPERTS', [])
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}