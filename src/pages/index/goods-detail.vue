<template>
  <view class="detail-page">
    <!-- 1. 轮播图 -->
    <swiper class="banner-swiper" indicator-dots circular :autoplay="true" interval="3000">
      <swiper-item v-for="(img, idx) in imgs" :key="idx">
        <image class="banner-img" :src="img" mode="aspectFill" @error="handleImgError"></image>
      </swiper-item>
    </swiper>

    <!-- 2. 商品基础信息 -->
    <view class="goods-info-card">
      <view class="goods-title">{{ detail.title || detail.name }}</view>
      <view class="goods-price">¥{{ detail.price }}</view>
      <view class="goods-seller">
        <image class="seller-avatar" :src="detail.avatar_url || '/static/default-avatar.png'" mode="aspectFill"></image>
        <text class="seller-name">{{ detail.nick_name || '匿名卖家' }}</text>
      </view>
    </view>

    <!-- 3. 商品描述 -->
    <view class="goods-desc-card">
      <view class="card-title">商品描述</view>
      <view class="desc-content">{{ detail.description || detail.content }}</view>
    </view>

    <!-- 4. 自提交易地址（核心新增模块） -->
    <view class="address-card">
      <view class="card-title">自提交易地址</view>
      <view class="address-content">
        <text class="address-full">
          {{ detail.province || '上海市' }}{{ detail.city || '上海市' }}{{ detail.district || '闵行区' }}{{ detail.street || '梅陇镇' }}{{ detail.detail_address || '' }}
        </text>
        <view class="address-tip">支持当面自提交易，交易前请核验商品</view>
      </view>
    </view>

    <!-- 5. 底部操作栏：收藏 + 立即购买 -->
    <view class="footer-bar">
      <view class="collect-btn" @tap="doCollect">
        <text class="collect-icon" :class="{ 'active': isCollect }">♥</text>
        <text class="collect-text">{{ isCollect ? '已收藏' : '收藏' }}</text>
      </view>
      <button class="buy-btn" @tap="toBuy">立即购买</button>
    </view>
  </view>
</template>

<script>
import { goodsApi } from '@/api/goods'
import { collectionsApi } from '@/api/collection'
import { orderApi } from '@/api/order'
export default {
  data() {
    return {
      goods_id: 0,
      detail: {},
      imgs: [],
      isCollect: false
    }
  },
  computed: {
    userInfo() {
      return uni.getStorageSync('userInfo') || {}
    }
  },
  onLoad(options) {
    this.goods_id = options.goods_id
    this.getDetail()
    this.getCollectStatus()
  },
  methods: {
    // 加载商品详情
    async getDetail() {
      try {
        const res = await goodsApi.getGoodsDetail({ goods_id: this.goods_id})
        if (res.code === 200) {
          this.detail = res.data
          this.imgs = res.data.image_url?.split(',') || []
        }
      } catch (err) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },

    // 获取收藏状态
    async getCollectStatus() {
      if (!this.userInfo?.user_id) return
      const res = await collectionsApi.getCollectStatus({user_id: this.userInfo?.user_id, goods_id: this.goods_id})
      this.isCollect = res.isCollect
    },

    // 收藏/取消收藏
    async doCollect() {
      if (!this.userInfo?.user_id) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      const res = await collectionsApi.toggleCollection({user_id: this.userInfo?.user_id, goods_id: this.goods_id})
      this.isCollect = res.isCollect
      uni.showToast({ title: res.msg, icon: 'none' })
    },

    // 立即购买（完善版：选择收货地址+下单）
    async toBuy() {
      if (!this.userInfo?.user_id) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      
      // 跳转到地址选择页，选择自提/收货地址
      uni.navigateTo({  
        url: `/pages/mine/address-list?from=buy&goods_id=${this.goods_id}`
      })
    },

    // 图片加载失败兜底
    handleImgError(e) {
      e.target.src = '/static/default-goods.png'
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.detail-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 轮播图 */
.banner-swiper {
  width: 100%;
  height: 500rpx;
  background-color: #f0f0f0;
}
.banner-img {
  width: 100%;
  height: 100%;
}

/* 商品信息卡片 */
.goods-info-card {
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
}
.goods-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 20rpx;
}
.goods-price {
  font-size: 44rpx;
  color: #ff3b30;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.goods-seller {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}
.seller-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
}
.seller-name {
  font-size: 28rpx;
  color: #666;
}

/* 通用卡片样式 */
.goods-desc-card, .address-card {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
}
.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

/* 商品描述 */
.desc-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

/* 自提地址模块 */
.address-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}
.address-full {
  display: block;
  margin-bottom: 10rpx;
}
.address-tip {
  font-size: 24rpx;
  color: #999;
}

/* 底部操作栏 */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 98rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-top: 1rpx solid #f0f0f0;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.collect-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}
.collect-icon {
  font-size: 36rpx;
  color: #999;
  transition: all 0.3s;
}
.collect-icon.active {
  color: #ff3b30;
}
.collect-text {
  font-size: 24rpx;
  color: #666;
}
.buy-btn {
  flex: 2;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #ff3b30;
  color: #fff;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
}
</style>