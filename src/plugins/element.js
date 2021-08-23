import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
//把message组件挂载到Vue的原型对象上去
Vue.prototype.$message = Message
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)