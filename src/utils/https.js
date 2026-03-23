import axios from 'axios';
// 引入小程序适配器（需先安装：npm install axios-miniprogram-adapter）
import mpAdapter from 'axios-miniprogram-adapter';

// 创建 axios 实例
const service = axios.create({
  // 基础路径（小程序本地调试需写完整后端地址，vite代理在小程序环境无效）
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    // 'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
  }
});

// 让axios适配小程序环境
service.defaults.adapter = mpAdapter;
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加 token 到请求头（登录后自动携带）
    const token = uni.getStorageSync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误：', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 统一处理后端返回的错误码（比如 token 过期、业务错误）
    if (res.code !== 200) {
      // token 过期：自动清除本地缓存并跳转登录页
      if (res.code === 401) {
        uni.removeStorageSync('token');
        uni.removeStorageSync('userInfo');
        uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
        uni.reLaunch({ url: '/pages/mine/index' });
        return Promise.reject(res);
      }
      uni.showToast({ title: res.msg || '请求失败', icon: 'none' });
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    // 统一捕获网络/接口错误
    console.error('接口请求错误：', error);
    // 区分网络错误和接口错误提示
    const errMsg = error.message.includes('Network Error') 
      ? '网络异常，请检查网络连接' 
      : error.msg || '服务器异常，请稍后重试';
    uni.showToast({
      title: errMsg,
      icon: 'none'
    });
    return Promise.reject(error);
  }
);

export default service;