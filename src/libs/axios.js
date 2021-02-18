import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  baseURL: 'http://app.shop.com.br/',
})

Vue.prototype.$http = axiosIns

export default axiosIns
