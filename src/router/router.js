import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/rights/Rights.vue'
import Roles from '../components/rights/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import AddGoods from '../components/goods/Add.vue'
import Orders from '../components/order/Orders.vue'
import Reports from '../components/report/Reports.vue'
import App from '../App.vue'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            component: Welcome
        }, {
            path: '/users',
            component: Users
        }, {
            path: '/rights',
            component: Rights

        }, {
            path: '/roles',
            component: Roles
        }, {
            path: '/categories',
            component: Categories
        }, {
            path: '/params',
            component: Params
        }, {
            path: '/goods',
            component: List
        }, {
            path: '/goods/add',
            component: AddGoods
        }, {
            path: '/orders',
            component: Orders
        }, {
            path: '/reports',
            component: Reports
        }]
    }
]

const router = new VueRouter({
        routes
    })
    //设置路由导航守卫
router.beforeEach((to, from, next) => {
    //如果输入的地址是login，放行
    if (to.path === '/login') return next()
        //如果不是login，获取sessionStorage里的token
    const tokenstr = window.sessionStorage.getItem('token')
        //如果获取不到，则代表用户没有登录，返回登录页面
    if (!tokenstr) return next('/login')
        //获取到了，放行
    next()
})
export default router