// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css';
import MyAxios from '@/plugins/myaxios';
import moment from 'moment';
Vue.config.productionTip = false;

// 注册
Vue.use(MyAxios);
Vue.use(ElementUI);

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
