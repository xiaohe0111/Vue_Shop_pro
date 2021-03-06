import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
// 导入home组件
import Home from '../components/Home.vue'
// 导入welcome组件  这个组件需要在home组件中显示,,所以是以子组件的形式展示的
import Welcome from '../components/Welcome.vue';
// 导入用户列表组件这个组件需要在home组件中显示,,所以是以子组件的形式展示的
import Users from '../components/users/Users.vue';
// 导入权限列表的组件,,这个组件需要在home组件中显示,,所以是以子组件的形式展示的
import Rights from '../components/Rights/Rights.vue'
// 导入权限列表的组件,,这个组件需要在home组件中显示,,所以是以子组件的形式展示的
import Roles from '../components/Rights/Roles.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/home', component: Home, redirect: '/welcome', children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }, { path: '/rights', component: Rights }, { path: '/roles', component: Roles }] }
  ]
})
// 这个是从网上复制的,为了防止路由重复而报错产生的影响,添加的
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
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
