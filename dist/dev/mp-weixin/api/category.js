"use strict";
const utils_https = require("../utils/https.js");
const categoryApi = {
  // 获取商品分类列表
  getCategoryList(params) {
    return utils_https.service({
      url: "/category/query",
      method: "get",
      params
    });
  },
  // 管理端接口-添加分类
  adminAddCategory(data) {
    return utils_https.service({
      url: "/api/admin/category/add",
      method: "POST",
      data
    });
  },
  // 管理端接口-编辑分类
  adminEditCategory(id, data) {
    return utils_https.service({
      url: `/api/admin/category/edit/${id}`,
      method: "PUT",
      data
    });
  },
  // 管理端接口-删除分类
  adminDeleteCategory(id) {
    return utils_https.service({
      url: `/api/admin/category/delete/${id}`,
      method: "DELETE"
    });
  },
  // 管理端接口-获取分类详情
  adminGetCategoryDetail(id) {
    return utils_https.service({
      url: `/api/admin/category/${id}`,
      method: "GET"
    });
  }
};
exports.categoryApi = categoryApi;
