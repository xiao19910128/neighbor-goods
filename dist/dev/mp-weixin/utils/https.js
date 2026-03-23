"use strict";
const common_vendor = require("../common/vendor.js");
const service = common_vendor.axios.create({
  // 基础路径（小程序本地调试需写完整后端地址，vite代理在小程序环境无效）
  baseURL: "http://localhost:3000/api",
  timeout: 1e4,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
    // 'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`
  }
});
service.defaults.adapter = common_vendor.mpAdapter;
service.interceptors.request.use(
  (config) => {
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("请求拦截器错误：", error);
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      if (res.code === 401) {
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.removeStorageSync("userInfo");
        common_vendor.index.showToast({ title: "登录已过期，请重新登录", icon: "none" });
        common_vendor.index.reLaunch({ url: "/pages/mine/index" });
        return Promise.reject(res);
      }
      common_vendor.index.showToast({ title: res.msg || "请求失败", icon: "none" });
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    console.error("接口请求错误：", error);
    const errMsg = error.message.includes("Network Error") ? "网络异常，请检查网络连接" : error.msg || "服务器异常，请稍后重试";
    common_vendor.index.showToast({
      title: errMsg,
      icon: "none"
    });
    return Promise.reject(error);
  }
);
exports.service = service;
