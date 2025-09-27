const state = {
  userInfo: null,
  token: localStorage.getItem('token') || ''
}

const getters = {
  userInfo: state => state.userInfo,
  token: state => state.token,
  isLogin: state => !!state.token
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  CLEAR_USER_INFO(state) {
    state.userInfo = null
    state.token = ''
    localStorage.removeItem('token')
  }
}

const actions = {
  setUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  },
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  logout({ commit }) {
    commit('CLEAR_USER_INFO')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}