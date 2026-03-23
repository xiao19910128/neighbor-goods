// 引入封装好的 axios 实例
import request from '@/utils/https.js';
export const userApi = {
  wxLogin(data) {
    return request({
      url: '/users/wxLogin',
      method: 'post',
      data
    });
  }, 
  wxLogout(data) {
    return request({
      url: '/users/wxLogout',
      method: 'post',
      data
    });
  }, 
  getSmsCode(data) {
    return request({
      url: '/users/getSmsCode',
      method: 'post',
      data
    });
  }, 
  phoneLogin(data) {
    return request({
      url: '/users/phoneLogin',
      method: 'post',
      data
    });
  }
}