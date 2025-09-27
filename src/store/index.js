import { createStore } from 'vuex'
import home from './modules/home'
import user from './modules/user'

export default createStore({
  state: {
    loading: false
  },
  getters: {
    loading: state => state.loading
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    }
  },
  modules: {
    home,
    user
  }
})