<template>
  <view class="publish-list-page">
    <!-- 页面标题 -->
    <!-- <view class="page-header">
      <text class="title">我的发布列表</text>
    </view> -->

    <!-- 空数据提示 -->
    <view class="empty-state" v-if="goodsList.length === 0 && !loading">
      <image src="/static/empty-published.png" class="empty-img"></image>
      <text class="empty-text">你还没有发布任何闲置~</text>
      <button class="publish-btn" @click="gotoPublish">去发布</button>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list" v-else>
      <view class="goods-item" v-for="item in goodsList" :key="item.goods_id">
        <!-- 商品图片 -->
        <image class="goods-img" :src="item.image_url.split(',')[0]" mode="aspectFill"></image>
        
        <!-- 商品信息 -->
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <view class="price-area">
            <text class="goods-price">¥{{ item.price }}</text>
            <text class="goods-street">{{ item.street }}</text>
          </view>
          
          <!-- 审核状态标签 -->
          <view class="status-tag" :class="getStatusClass(item.audit_status)">
            {{ getStatusText(item.audit_status) }}
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons">
          <button class="btn-edit" @click="editGoods(item)">编辑</button>
          <button class="btn-delete" @click="deleteGoods(item.goods_id)">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { goodsApi } from '@/api/goods';
export default {
  data() {
    return {
      goodsList: [], // 我发布的商品列表
      page: 1, // 当前页码
      size: 10, // 每页条数
      loading: false, // 加载状态
      hasMore: true, // 是否有更多数据
      loadMoreStatus: 'more', // 加载更多状态：more/noMore/loading
      userId: uni.getStorageSync('userId') || 1 // 当前登录用户ID（需替换为实际用户ID）
    };
  },
  onLoad(options) {
    // 页面加载时获取我发布的商品列表
    this.getPublishedGoods();
    
    // 如果是发布成功后跳转过来，显示提示
    if (options.from === 'publish') {
      uni.showToast({ title: '发布成功！', icon: 'success' });
    }
  },
  onReachBottom() {
    // 下拉触底加载更多
    if (this.hasMore && !this.loading) {
      this.loadMore();
    }
  },
  methods: {
    // 获取我发布的商品列表
    async getPublishedGoods() {
      try {
        this.loading = true;
        this.loadMoreStatus = 'loading';
        
        // 调用后端接口（根据用户ID筛选）    
            // published这个接口根本没有请求，页面控制台也没有报错
        const publishedRes = await goodsApi.getGoodsPublished({
          user_id: 2 || uni.getStorageSync('userId') // TODO 这里待拿到用户登录信息
        }); 
        if (publishedRes?.code === 200) {
          const { list, total } = publishedRes?.data;
          // 第一页清空列表，后续页面追加
          if (this.page === 1) {
            this.goodsList = list;
          } else {
            this.goodsList = [...this.goodsList, ...list];
          }
          // 判断是否有更多数据
          this.hasMore = this.goodsList?.length < total;
          this.loadMoreStatus = this.hasMore ? 'more' : 'noMore';
        }
      } catch (err) {
        uni.showToast({ title: '111获取数据失败', icon: 'none' });
      } finally {
        this.loading = false;
        this.loadMoreStatus = 'more';
      }
    },
    // 加载更多
    loadMore() {
      if (!this.hasMore) return;
      this.page++;
      this.getPublishedGoods();
    },
    // 格式化时间
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    // 跳转到发布页
    gotoPublish() {
      uni.navigateTo({ url: '/pages/publish/index' });
    },
    // 跳转到商品详情
    gotoDetail(goodsId) {
      uni.navigateTo({ url: `/pages/detail/index?id=${goodsId}` });
    },
    // 编辑商品
    editGoods(goods) {
      uni.navigateTo({ url: `/pages/publish/index?goods_id=${goods.goods_id}` });
    },
    // 删除商品
    async deleteGoods(goodsId) {
      uni.showModal({
        title: '确认删除',
        content: '删除后无法恢复，确定要删除吗？',
        async success(res) {
          if (res.confirm) {
            try {
              const delRes = await uni.request({
                url: '/api/goods/deletePublished',
                method: 'POST',
                data: { id: goodsId }
              });
              if (delRes.data.code === 200) {
                uni.showToast({ title: '删除成功' });
                // 重新加载列表
                this.page = 1;
                this.getPublishedGoods();
              }
            } catch (err) {
              uni.showToast({ title: '删除失败', icon: 'none' });
            }
          }
        }
      });
    },

    // 映射审核状态文字
    getStatusText(status) {
      const statusMap = {
        0: '待审核',
        1: '审核通过',
        2: '审核拒绝',
        3: '已下架'
      };
      return statusMap[status] || '未知状态';
    },

    // 映射状态标签样式类
    getStatusClass(status) {
      const classMap = {
        0: 'status-pending',
        1: 'status-pass',
        2: 'status-reject',
        3: 'status-offline'
      };
      return classMap[status] || 'status-default';
    },
  }
};
</script>

<style scoped>
.published-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20rpx;
}

/* 页面标题 */
.page-header {
  background-color: #fff;
  padding: 30rpx;
  border-bottom: 1px solid #eee;
}
.title {
  font-size: 36rpx;
  font-weight: 500;
  color: #333;
}

/* 空数据 */
.empty-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}
.empty-img {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}
.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 40rpx;
}
.publish-btn {
  width: 60%;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  border-radius: 40rpx;
}

/* 商品列表 */
.goods-list {
  padding: 20rpx;
}
.goods-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
}
.goods-img {
  width: 100%;
  height: 300rpx;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}
.goods-img image {
  width: 100%;
  height: 100%;
}
.goods-info {
  margin-bottom: 20rpx;
}
.goods-title {
  font-size: 32rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10rpx;
}
.goods-price {
  font-size: 36rpx;
  color: #ff3b30;
  font-weight: 500;
  margin-bottom: 10rpx;
}
.goods-address {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}
.goods-time {
  font-size: 24rpx;
  color: #999;
}
.goods-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  margin-top: 10rpx;
}
.action-btn {
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
}
.action-btn.edit {
  background-color: #e5e5e5;
  color: #333;
}
.action-btn.delete {
  background-color: #ff3b30;
  color: #fff;
}

/* 加载状态 */
.loading-view {
  padding: 30rpx;
  text-align: center;
  font-size: 28rpx;
  color: #999;
}

.publish-list-page {
  background-color: #f7f8fa;
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  background-color: #fff;
  padding: 30rpx;
  text-align: center;
  border-bottom: 1px solid #eee;
}
.title {
  font-size: 36rpx;
  font-weight: 500;
  color: #333;
}

/* 空数据状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}
.empty-img {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}
.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 40rpx;
}
.publish-btn {
  width: 60%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 40rpx;
  font-size: 32rpx;
}

/* 商品列表 */
.goods-list {
  padding: 20rpx;
}
.goods-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}
.goods-img {
  width: 100%;
  height: 360rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.goods-info {
  margin-bottom: 24rpx;
}
.goods-name {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
}
.price-area {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}
.goods-price {
  font-size: 36rpx;
  color: #ff3b30;
  font-weight: 600;
  margin-right: 16rpx;
}
.goods-street {
  font-size: 28rpx;
  color: #666;
}

/* 审核状态标签 */
.status-tag {
  display: inline-block;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}
.status-pending {
  background-color: #fff7e6;
  color: #fa8c16;
}
.status-pass {
  background-color: #f6ffed;
  color: #52c41a;
}
.status-reject {
  background-color: #fff2f0;
  color: #ff4d4f;
}
.status-offline {
  background-color: #f5f5f5;
  color: #999;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 20rpx;
  justify-content: end;
}
.btn-edit, .btn-delete {
  /* flex: 1; */
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  text-align: center;
  margin: 0;
}
.btn-edit {
  background-color: #e9ffe1;
  color: #333;
  border: 1px solid #e0e0e0;
}
.btn-delete {
  background-color: #ff4d4f;
  color: #fff;
}
</style>