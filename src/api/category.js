// 引入封装好的 axios 实例
import request from '@/utils/https.js';
export const categoryApi = {
  // 获取商品分类列表
  getCategoryList(params) {
    return request({
      url: '/category/query',
      method: 'get',
      params
    });
  }, 
  // 管理端接口-添加分类
  adminAddCategory(data) {
    return request({
      url: '/api/admin/category/add',
      method: 'POST',
      data
    });
  },
  // 管理端接口-编辑分类
  adminEditCategory(id, data) {
    return request({
      url: `/api/admin/category/edit/${id}`,
      method: 'PUT',
      data
    });
  },
  // 管理端接口-删除分类
  adminDeleteCategory(id) {
    return request({
      url: `/api/admin/category/delete/${id}`,
      method: 'DELETE'
    });
  },
  // 管理端接口-获取分类详情
  adminGetCategoryDetail(id) {
    return request({
      url: `/api/admin/category/${id}`,
      method: 'GET'
    });
  },
}