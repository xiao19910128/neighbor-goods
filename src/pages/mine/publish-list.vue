<template>
  <view class="published-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="title">我发布的</text>
    </view>
    <!-- 空数据提示 -->
    <view class="empty-view" v-if="goodsList && !goodsList.length && !loading">
      <image src="/static/empty-published.png" class="empty-img"></image>
      <text class="empty-text">你还没有发布任何闲置~</text>
      <button type="primary" class="publish-btn" @click="gotoPublish">去发布</button>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list" v-else>
      <view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="gotoDetail(item.id)">
        <!-- 商品图片 -->
        <view class="goods-img">
          <image :src="item.image_url.split(',')[0]" mode="aspectFill"></image>
        </view>
        <!-- 商品信息 -->
        <view class="goods-info">
          <text class="goods-title">{{ item.name }}</text>
          <text class="goods-price">¥{{ item.price }}</text>
          <text class="goods-address">{{ item.street }}{{ item.detail_address || '' }}</text>
          <text class="goods-time">{{ formatTime(item.create_time) }}</text>
        </view>
        <!-- 操作按钮 -->
        <view class="goods-actions">
          <button class="action-btn edit" @click.stop="editGoods(item)">编辑</button>
          <button class="action-btn delete" @click.stop="deleteGoods(item.id)">删除</button>
        </view>
      </view>
    </view>

    <!-- 加载中提示 -->
    <view class="loading-view" v-if="loading">
      <text>加载中...</text>
    </view>

    <!-- 下拉加载更多 -->
    <uni-load-more 
      :status="loadMoreStatus" 
      @clickLoadMore="loadMore"
    ></uni-load-more>
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
      uni.navigateTo({ url: `/pages/publish/index?editId=${goods.id}` });
    },
    // 删除商品
    async deleteGoods(goodsId) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该商品吗？删除后不可恢复',
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
    }
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
</style>