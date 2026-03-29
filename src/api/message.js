// 引入封装好的 axios 实例
import request from '@/utils/https.js';
export const messageApi = {
  sendMessage(data) {
    return request({
      url: '/message/send',
      method: 'post',
      data
    });
  }, 
  messageLists(data) {
    return request({
      url: '/message/list',
      method: 'post',
      data
    });
  }, 
  markRead(data) {
    return request({
      url: '/message/markRead',
      method: 'post',
      data
    });
  }, 
  sessionList(data) {
    return request({
      url: '/message/sessionList',
      method: 'post',
      data
    });
  },
}