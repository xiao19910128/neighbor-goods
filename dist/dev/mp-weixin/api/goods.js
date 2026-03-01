"use strict";
const utils_https = require("../utils/https.js");
const goods = {
  getGoodsList(params) {
    return utils_https.service({
      url: "/goods/query",
      method: "get",
      params
    });
  },
  getGoodsDetail(id) {
    return utils_https.service({
      url: `/goods/detail/${id}`,
      method: "get"
    });
  },
  addGoods(data) {
    return utils_https.service({
      url: "/goods/add",
      method: "post",
      data
    });
  }
};
exports.goods = goods;
