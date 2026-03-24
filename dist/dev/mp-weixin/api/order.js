"use strict";
const utils_https = require("../utils/https.js");
const orderApi = {
  createOrder(data) {
    return utils_https.service({
      url: "/orders/create",
      method: "post",
      data
    });
  }
};
exports.orderApi = orderApi;
