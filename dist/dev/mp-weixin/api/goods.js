"use strict";
const utils_https = require("../utils/https.js");
const goodsApi = {
  // 获取商品列表
  getGoodsList(params) {
    return utils_https.service({
      url: "/goods/query",
      method: "get",
      params
    });
  },
  // 获取商品详情
  getGoodsDetail(id) {
    return utils_https.service({
      url: `/goods/detail/${id}`,
      method: "get"
    });
  },
  // 发布商品信息
  publishGoods(data) {
    return utils_https.service({
      url: "/goods/publish",
      method: "post",
      data
    });
  },
  addGoods(data) {
    return utils_https.service({
      url: "/goods/add",
      method: "post",
      data
    });
  },
  // 获取已发布商品列表
  getGoodsPublished(params) {
    return utils_https.service({
      url: `/goods/published`,
      method: "get",
      params
    });
  },
  // 获取商品详情
  getGoodsDetail(params) {
    return utils_https.service({
      url: "/goods/detail",
      method: "get",
      params
    });
  },
  // 更新商品（编辑提交）
  updateGoods(data) {
    return utils_https.service({
      url: "/goods/update",
      method: "post",
      data
    });
  },
  // 删除发布的商品
  deleteGoods(data) {
    return utils_https.service({
      url: "/goods/deletePublished",
      method: "post",
      data
    });
  }
};
exports.goodsApi = goodsApi;
