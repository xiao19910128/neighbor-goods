"use strict";
const utils_https = require("../utils/https.js");
const addressApi = {
  // 获取地址列表-user_id 参数
  getAddressList(data) {
    return utils_https.service({
      url: "/address/list",
      method: "get",
      data
    });
  },
  // 新增地址信息
  addAddress(data) {
    return utils_https.service({
      url: "/address/add",
      method: "POST",
      data
    });
  },
  // 更新地址信息
  updateAddress(data) {
    return utils_https.service({
      url: "/address/update",
      method: "POST",
      data
    });
  },
  // 删除地址信息
  deleteAddress(data) {
    return utils_https.service({
      url: "/address/delete",
      method: "POST",
      data
    });
  }
};
exports.addressApi = addressApi;
