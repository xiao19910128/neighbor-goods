"use strict";
const utils_https = require("../utils/https.js");
const orderApi = {
  createOrder(data) {
    return utils_https.service({
      url: "/orders/create",
      method: "post",
      data
    });
  },
  getOrderList(data) {
    return utils_https.service({
      url: "/orders/list",
      method: "get",
      data
    });
  },
  updateOrderStatus(data) {
    return utils_https.service({
      url: "/orders/updateStatus",
      method: "post",
      data
    });
  },
  getOrderDetail(data) {
    return utils_https.service({
      url: "/orders/detail",
      method: "get",
      params: data
    });
  }
};
exports.orderApi = orderApi;
