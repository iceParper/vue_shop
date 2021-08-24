import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
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