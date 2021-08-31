import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
//将axios定义到Vue的prototype中去，这样全局就可以使用axios进行数据请求
Vue.prototype.$http = axios
    //添加API的默认地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //利用拦截器给，当向api请求数据的时候，给请求的请求头上加上token令牌，确保一些需要令牌的api可以调用
axios.interceptors.request.use(config => {
        // console.log(config);
        //在请求头中加上Authorization属性，用来存放token令牌
        config.headers.Authorization = window.sessionStorage.getItem('token')
            //必须把config return出去
        return config
    })
    //导入element-ui
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式
import './assets/css/global.css'
//全局注册Tree-grid组件
Vue.component('tree-table', treeTable)
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')