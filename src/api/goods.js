// src/api/goods.js
// 引入封装好的 axios 实例
import request from '@/utils/https.js';

/**
 * 获取商品列表
 * @param {Object} params - 查询参数（比如页码、页数、筛选条件）
 * @returns {Promise} 返回商品列表数据
 */
export const goods = {
  getGoodsList(params) {
    return request({
      url: '/goods/query',
      method: 'get',
      params
    });
  }, 
  getGoodsDetail(id) {
      return request({
        url: `/goods/detail/${id}`,
        method: 'get'
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