import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标的样式
import './assets/fonts/iconfont.css'
// 配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在吧axios挂载到vue之前,需要对axios处理拦截请求
axios.interceptors.request.use(config => {
  // 为请求头对象添加token验证的authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 把axios挂载到vue的原型对象上
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
