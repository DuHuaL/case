import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login';
import Home from '@/views/home';
import List from '@/views/users/list';
import Rights from '@/views/roles/rights';
Vue.use(Router);

export default new Router({
  routes: [
    { name: 'login', path: '/login', component: Login },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        // 子路由
        { name: 'list', path: 'users', component: List },
        { name: 'right', path: 'rights', component: Rights }
      ]
    }
  ]
});
