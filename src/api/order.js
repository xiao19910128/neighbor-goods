
import request from '@/utils/https.js';
export const orderApi = {
  createOrder(data) {
    return request({
      url: '/orders/create',
      method: 'post',
      data
    });
  }, 

  getOrderList(data) {
    return request({
      url: '/orders/list',
      method: 'get',
      data
    });
  }, 

  updateOrderStatus(data) {
    return request({
      url: '/orders/updateStatus',
      method: 'post',
      data
    });
  }, 
}