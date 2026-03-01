"use strict";
const common_vendor = require("../common/vendor.js");
const service = common_vendor.axios.create({
  // 基础路径（配合 vite 代理，无需写完整域名）
  baseURL: "/api",
  // 请求超时时间
  timeout: 1e4,
  // 请求头默认配置
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});
service.interceptors.request.use(
  (config) => {
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
    return res;
  },
  (error) => {
    console.error("接口请求错误：", error);
    common_vendor.index.showToast({
      title: error.message || "网络异常，请稍后重试",
      icon: "none"
    });
    return Promise.reject(error);
  }
);
exports.service = service;
