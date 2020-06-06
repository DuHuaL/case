import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
// 使用路由懒加载 build之后
const Login = () => import('@/views/login');
const Home = () => import('@/views/home');
const List = () => import('@/views/users/list');
const Rights = () => import('@/views/roles/rights');
const Roles = () => import('@/views/roles/roles');
const Categories = () => import('@/views/goods/categories');
const Goods = () => import('@/views/goods/goods');
const GoodsAdd = () => import('@/views/goods/goodsadd');
const Params = () => import('@/views/goods/params');
const Orders = () => import('@/views/orders/orders');
const Reports = () => import('@/views/reports/reports');

// 导入组件 打包之前的
// import Login from '@/views/login';
// import Home from '@/views/home';
// import List from '@/views/users/list';
// import Rights from '@/views/roles/rights';
// import Roles from '@/views/roles/roles';
// import Categories from '@/views/goods/categories';
// import Goods from '@/views/goods/goods';
// import GoodsAdd from '@/views/goods/goodsadd';
// import Params from '@/views/goods/params';
// import Orders from '@/views/orders/orders';
// import Reports from '@/views/reports/reports';

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
        { name: 'roles', path: 'roles', component: Roles },
        { name: 'categories', path: 'categories', component: Categories },
        { name: 'goods', path: 'goods', component: Goods },
        { name: 'goodsadd', path: 'goods/add', component: GoodsAdd },
        { name: 'params', path: 'params', component: Params },
        { name: 'orders', path: 'orders', component: Orders },
        { name: 'reports', path: 'reports', component: Reports }
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
      Message.warning('请先登录');
      // 跳转到登录
      router.push({ name: 'login' });
    }
  }
});
export default router;
