
import request from '@/utils/https.js';

export const addressApi = {
  // 获取地址列表-user_id 参数
  getAddressList(data) {
    return request({
      url: '/address/list',
      method: 'get',
      data
    });
  }, 
  // 新增地址信息
  addAddress(data) {
    return request({
      url: '/address/add',
      method: 'POST',
      data
    });
  },
  // 更新地址信息
  updateAddress(data) {
    return request({
      url: '/address/update',
      method: 'POST',
      data
    });
  },
  // 删除地址信息
  deleteAddress(data) {
    return request({
      url: '/address/delete',
      method: 'POST',
      data
    });
  }
}