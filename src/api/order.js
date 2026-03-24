
import request from '@/utils/https.js';
export const orderApi = {
  createOrder(data) {
    return request({
      url: '/orders/create',
      method: 'post',
      data
    });
  }, 
}