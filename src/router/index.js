import Vue from 'vue'

import Router from 'vue-router'

import Login from '../views/login'
import Home from '../views/home'
import WelCome from '../views/home/welcome'
import Users from '../views/home/users'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: WelCome },
        { path: '/users', component: Users }
      ]
    }
  ]
})

/* 
  路由导航拦截
*/
router.beforeEach((to, from, next) => {
  /* 
    1.登录不拦截
    2.非登录用户 token 页面拦截
      2.1 有token 放行 next
      2.2 没有token 强制跳转到登录
  */
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  next();
})


export default router;