// 引入封装好的 axios 实例
import request from '@/utils/https.js';
export const goodsApi = {
  // 获取商品列表
  getGoodsList(params) {
    return request({
      url: '/goods/query',
      method: 'get',
      params
    });
  }, 
  // 获取商品详情
  getGoodsDetail(id) {
      return request({
        url: `/goods/detail/${id}`,
        method: 'get'
      });
  },
  // 发布商品信息
  publishGoods(data) {
    return request({
      url: "/goods/publish",
      method: "post",
      data
    });
  },
  addGoods(data) {
    return request({
      url: '/goods/add',
      method: 'post',
      data
    });
  }
}