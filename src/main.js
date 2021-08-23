import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import axios from 'axios'
//将axios定义到Vue的prototype中去，这样全局就可以使用axios进行数据请求
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //导入element-ui
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式
import './assets/css/global.css'
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')