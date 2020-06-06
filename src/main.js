// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
// 打包是使用的cdn， 这里引入的第三方包的css就不需要了
// import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css';
import MyAxios from '@/plugins/myaxios';
import moment from 'moment';
// 导入封装的面包屑组件
import MyBreadcrumb from '@/components/MyBreadcrumb';
// 导入tree_gird
import ElTreeGrid from 'element-tree-grid';
Vue.component(ElTreeGrid.name, ElTreeGrid);
Vue.config.productionTip = false;

// 全局注册
Vue.use(MyAxios);
Vue.use(ElementUI);

// 全局组件
Vue.component(MyBreadcrumb.name, MyBreadcrumb);
// 格式化日期
Vue.filter('fmtDate', (value, fmtStr) => {
  return moment(value).format(fmtStr);
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
