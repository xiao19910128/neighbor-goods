// src/utils/https.js
import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  // 基础路径（配合 vite 代理，无需写完整域名）
  baseURL: '/api',
  // 请求超时时间
  timeout: 10000,
  // 请求头默认配置
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器（可添加 token、请求加载提示等）
service.interceptors.request.use(
  (config) => {
    // 示例：添加 token 到请求头（如有登录鉴权）
    // const token = uni.getStorageSync('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误：', error);
    return Promise.reject(error);
  }
);

// 响应拦截器（统一处理返回结果、错误提示）
service.interceptors.response.use(
  (response) => {
    // 只返回响应的 data 部分，简化调用
    const res = response.data;
    // 示例：统一处理后端返回的错误码（比如 token 过期、业务错误）
    // if (res.code !== 200) {
    //   uni.showToast({ title: res.msg || '请求失败', icon: 'none' });
    //   return Promise.reject(res);
    // }
    return res;
  },
  (error) => {
    // 统一捕获网络/接口错误
    console.error('接口请求错误：', error);
    uni.showToast({
      title: error.msg || '网络异常，请稍后重试',
      icon: 'none'
    });
    return Promise.reject(error);
  }
);

// 对外暴露通用请求方法
export default service;