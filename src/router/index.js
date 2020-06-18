import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
// 导入home组件
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})
// 挂载路由导航守卫beforeEach
router.beforeEach((to, from, next) => {
  // 如果访问的是登录页面就直接放行
  if (to.path === '/login') return next()
  // 如果访问的不是登录页面
  // 获取到token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token值为空 就强制回到登录页面
  if (!tokenStr) return next('/login')
  // 否则就直接放行
  next()
})
export default router
