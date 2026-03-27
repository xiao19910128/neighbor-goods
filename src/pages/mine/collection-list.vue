<template>
  <view class="collect-page">
    <!-- 收藏商品列表 -->
    <view class="goods-list">
      <view 
        class="goods-card" 
        v-for="item in collectList" 
        :key="item.goods_id"
        @click="goDetail(item.goods_id)"
      >
        <image 
          class="goods-img" 
          :src="item.images[0] || '/static/default.png'" 
          mode="aspectFill"
          @error="handleImgError"
        ></image>
        <view class="goods-info">
          <text class="title">{{ item.name }}</text>
          <text class="price">¥{{ item.price }}</text>
          <text class="address-tip" v-if="item.district">
            📍 {{ item.district }} · 支持自提
          </text>
        </view>
        <!-- 取消收藏按钮 -->
        <button class="cancel-btn" @click.stop="toggleCollect(item.goods_id)">
          取消收藏
        </button>
      </view>

      <!-- 空状态 -->
      <view v-if="collectList.length === 0" class="empty-state">
        <image class="empty-icon" src="/static/empty-collect.png" mode="aspectFit"></image>
        <text class="empty-text">暂无收藏的商品</text>
      </view>
    </view>


    <button class="to-index-btn" @click="goHome">去逛逛</button>
  </view>
</template>

<script>
import { collectionsApi } from '@/api/collection.js'

export default {
  data() {
    return {
      collectList: [],
      userInfo: {},
    }
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo') || {}
    this.getCollectList()
  },
  methods: {
    // 获取收藏列表
    async getCollectList() {
      const { user_id = '' } = this.userInfo || {}
      if ( !user_id ) return
      const res = await collectionsApi.getCollectionsList({ user_id })
      if (res.code === 200) {
        this.collectList = res.data?.map(item=> ({
          ...item,
          images: item?.image_url?.split(',')
        }))
      }      
    },

    // 取消收藏
    async toggleCollect(goods_id) {
      uni.showModal({
        title: '提示',
        content: '确定取消收藏该商品吗？',
        success: async () => {
          const { user_id = '' } = this.userInfo || {}    
          await collectionsApi.toggleCollection({
            user_id,
            goods_id: goods_id
          })
          uni.showToast({ title: '取消收藏成功' })
          this.getCollectList()
        }
      })
    },

    // 跳转到商品详情
    goDetail(goods_id) {
      uni.navigateTo({
        url: `/pages/goods/detail?goods_id=${goods_id}`
      })
    },

    // 图片加载失败兜底
    handleImgError(e) {
      e.target.src = '/static/default.png'
    },

    // 空状态跳转首页
    goHome() {
      uni.navigateTo({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.collect-page {
  display: flex;
  flex-direction: column;
  padding: 0 20rpx;
  height: calc(100vh - 90rpx);
  background-color: #f5f5f5;
}

/* 商品列表 */
.goods-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 商品卡片 */
.goods-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  gap: 20rpx;
  position: relative;
  overflow: hidden;
}

/* 商品图片 */
.goods-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  background-color: #f0f0f0;
  flex-shrink: 0;
}

/* 商品信息 */
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10rpx 0;
}

.title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  /* 标题两行省略 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.price {
  font-size: 36rpx;
  color: #ff3b30;
  font-weight: bold;
  margin: 10rpx 0;
}

.address-tip {
  font-size: 24rpx;
  color: #999;
}

/* 取消收藏按钮 */
.cancel-btn {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 8rpx;
  font-size: 24rpx;
  padding: 6rpx 12rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  color: #999;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  margin-bottom: 30rpx;
}

.to-index-btn {
  width: 100%;
  background-color: #07c160;
  color: #fff;
  border-radius: 12rpx;
  padding: 16rpx 40rpx;
  font-size: 28rpx;
}
</style>