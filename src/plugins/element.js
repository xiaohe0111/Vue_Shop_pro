import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Submenu, Menu, MenuItem } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
// 全局挂载message
Vue.prototype.$message = Message
