import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
//导入富为本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富为本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//将axios定义到Vue的prototype中去，这样全局就可以使用axios进行数据请求
Vue.prototype.$http = axios
    //添加API的默认地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //利用拦截器给，当向api请求数据的时候，给请求的请求头上加上token令牌，确保一些需要令牌的api可以调用
axios.interceptors.request.use(config => {
    //显示进度条
    NProgress.start()
        // console.log(config);
        //在请求头中加上Authorization属性，用来存放token令牌
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //必须把config return出去
    return config
})
axios.interceptors.response.use(config => {
        //隐藏进度条
        NProgress.done()
        return config
    })
    //导入element-ui
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式
import './assets/css/global.css'
import { omit } from 'lodash'
//全局注册Tree-grid组件
Vue.component('tree-table', treeTable)
Vue.config.productionTip = false
    //将富文本注册成全局可以的组件
Vue.use(VueQuillEditor)
    //全局过滤器，时间格式化
Vue.filter('dateFormat', function(value, arg) {
    function dateFormat(date, format) {
        if (typeof date === "string") {
            var mts = date.match(/(\/Date\((\d+)\)\/)/);
            if (mts && mts.length >= 3) {
                date = parseInt(mts[2]);
            }
        }
        date = new Date(date);
        if (!date || date.toUTCString() == "Invalid Date") {
            return "";
        }
        var map = {
            "M": date.getMonth() + 1, //月份 
            "d": date.getDate(), //日 
            "h": date.getHours(), //小时 
            "m": date.getMinutes(), //分 
            "s": date.getSeconds(), //秒 
            "q": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };

        format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    }
    return dateFormat(value, arg);
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')