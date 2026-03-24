
import request from '@/utils/https.js';
export const collectionsApi = {
  toggleCollection(data) {
    return request({
      url: '/collections/toggle',
      method: 'post',
      data
    });
  }, 
  getCollectStatus(data) {
    return request({
      url: '/collections/status',
      method: 'get',
      data
    });
  }, 
}