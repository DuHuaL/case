import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login';
import Home from '@/views/home';
import List from '@/views/users/list';
import Rights from '@/views/roles/rights';
import Roles from '@/views/roles/roles';
import { Message } from 'element-ui';
Vue.use(Router);

const router = new Router({
  routes: [
    { name: 'login', path: '/login', component: Login },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        // 子路由
        { name: 'list', path: 'users', component: List },
        { name: 'right', path: 'rights', component: Rights },
        { name: 'roles', path: 'roles', component: Roles }
      ]
    }
  ]
});

// 导出之前，设置路由的前置路由守卫
// 在路由跳转之前做的事情
router.beforeEach((to, from, next) => {
  // 判断是否登录
  // 登录页面不需要token
  if (to.name === 'login') {
    next();
  } else {
    // 判断是否有token
    const token = sessionStorage.getItem('token');
    if (token) {
      next();
    } else {
      // 提示
      Message.success('请先登录')
      // 跳转到登录
      router.push({ name: 'login' });
    }
  }
});
export default router;
