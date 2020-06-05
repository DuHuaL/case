import axios from 'axios';
import { Message } from 'element-ui';
const MyAxios = {};
MyAxios.install = function(Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/',
    timeout: 1000
  });
  // 设置axios的拦截器
  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 请求的拦截器
    // 请求登录接口的时候，不需要加
    if (config.url.toLowerCase() !== 'login') {
      // 如果不是login需要携带
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // 当获取到服务器的响应之后，在返回给请求之前
    const { data: { meta: { status, msg } } } = response;
    // 根据不同的错误码，做不同的提示
    if (status !== 200 && status !== 201) {
      Message.error(msg);
    }
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
  // 设置Vue实例的属性u
  Vue.prototype.$http = instance;
};

export default MyAxios;
