<template>
  <view class="collect-list">
    <view class="goods-card" v-for="item in collectList" :key="item.goods_id">
      <image class="goods-img" :src="JSON.parse(item.images)[0] || '/static/default.png'" mode="aspectFill"></image>
      <view class="goods-info">
        <text class="title">{{ item.title }}</text>
        <text class="price">¥{{ item.price }}</text>
      </view>
    </view>
    <view v-if="collectList.length === 0" class="empty">
      <text>暂无收藏</text>
    </view>
  </view>
</template>

<script>
import {  } from '@/api/collection.js';
export default {
  data() {
    return {
      collectList: []
    };
  },
  onLoad() {
    this.getCollectList();
  },
  methods: {
    async getCollectList() {
      const userInfo = uni.getStorageSync('userInfo');
      // const res = await getMyCollectApi({ user_id: userInfo.user_id });
      // if (res.code === 200) {
      //   this.collectList = res.data;
      // }
    }
  }
};
</script>