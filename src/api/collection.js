
import request from '@/utils/https.js';
export const collectionsApi = {
  getCollectionsList(data) {
    return request({
      url: '/collections/myList',
      method: 'get',
      data
    });
  }, 
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