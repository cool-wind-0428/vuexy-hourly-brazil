export default {

  namespaced: true,

  state: () => ({
    user: null
  }),

  mutations: {
    setUser(state, user) {
      state.user = user
    }
  },

  getters: {
    isLoggedIn: user => {
      return localStorage.getItem('userData') && localStorage.getItem('accessToken')
    }
  },

  actions: {



    async loggout({ commit, state }) {
      commit('setUser', null)
    },

    async loadUser({ commit, state }) {

    }
  }
}