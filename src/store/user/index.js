import axios from '@axios'

export default {
  namespaced: true,
  state: {

  },

  mutations: {

  },



  actions: {
    fetchUsers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/user/list', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get('/user/show/' + id)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addUser(ctx, userData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/users/store', { user: userData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}