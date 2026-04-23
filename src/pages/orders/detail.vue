<template>
  <view class="container">

    <!-- 商品信息 -->
    <view class="card goods-card">
      <view class="card-title">商品信息</view>
      <view class="goods-box" @click="uni.redirectTo({url: `/pages/index/goods-detail?goods_id=${orderInfo.goods_id}`})">
        <image class="goods-img" :src="orderInfo.imageUrl" mode="aspectFill"></image>
        <view class="goods-info">
          <view class="goods-name">{{orderInfo.goods_name}}</view>
          <view class="goods-price">¥{{orderInfo.goods_price}}</view>
        </view>
      </view>
      <!-- <view class="info-row mt10">
        <text>商品状态：</text>
        <text class="status-tag {{orderInfo.goods_status === 2 ? 'ing' : orderInfo.goods_status === 1 ? 'normal' : 'gray'}}">
          {{orderInfo.goods_status === 0 ? '已下架' : orderInfo.goods_status === 1 ? '可售' : orderInfo.goods_status === 2 ? '交易中' : '已售出'}}
        </text>
      </view> -->
    </view>

    <!-- 买家信息 -->
    <view class="card">
      <view class="card-title">买家信息</view>
      <view class="info-row">
        <text>买家：</text>
        <text>{{orderInfo.buyer_name || '匿名用户'}}</text>
      </view>
      <view class="info-row">
        <text>联系电话：</text>
        <text>{{orderInfo.buyer_phone || '无'}}</text>
      </view>
    </view>

    <!-- 卖家信息 -->
    <view class="card">
      <view class="card-title">卖家信息</view>
      <view class="info-row">
        <text>卖家：</text>
        <text>{{orderInfo.seller_name || '匿名用户'}}</text>
      </view>
      <view class="info-row">
        <text>联系电话：</text>
        <text>{{orderInfo.seller_phone || '无'}}</text>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="card">
      <view class="card-title">交易信息</view>
      <view class="info-row">
        <text>订单状态：</text>
        <text :class="['order-status', statusMap[orderInfo?.order_status]?.order_status]">{{ statusMap[orderInfo?.order_status]?.text }}</text>
      </view>
      <view class="info-row">
        <text>实付金额：</text>
        <text class="price-red">¥{{orderInfo.goods_price}}</text>
      </view>
      <view class="info-row">
        <text>订单状态：</text>
        <text>{{orderInfo.order_status_text}}</text>
      </view>
      <view class="info-row">
        <text>订单号：</text>
        <text>{{orderInfo.order_no}}</text>
      </view>
      <view class="info-row">
        <text>创建时间：</text>
        <text>{{orderInfo.created_time}}</text>
      </view>
    </view>

    <!-- 底部操作栏（沟通+状态按钮） -->
    <view class="btn-box">
      <template v-if="orderInfo.order_status !== 4 && orderInfo.order_status !== 5">
        <!-- 我买到的 → 按钮 -->
        <template v-if="currentType === 'buy'">
          <button 
            class="order-btn"
            v-if="orderInfo.order_status === 1"
            @click.stop="updateStatus(orderInfo.order_id, 5)"
          >取消订单</button>
          <button 
            v-if="orderInfo.order_status === 2"
            class="order-btn warning"
            @click.stop="updateStatus(orderInfo.order_id, 3)"
          >已自提</button>
          <button 
            class="order-btn error"
            v-if="orderInfo.order_status === 2"
            @click.stop="refundOrder(orderInfo.order_id)"
          >退单</button>
        </template>

        <!-- 我卖出的 → 按钮 -->
        <template v-if="currentType === 'sell'">
          <button 
            class="order-btn primary"
            v-if="orderInfo.order_status === 1"
            @click.stop="updateStatus(orderInfo.order_id, 2)"
          >确认交易</button>
          <!-- 卖家确认完成，订单结束 -->
          <button 
            v-if="orderInfo.order_status === 3 && orderInfo.seller_id === userInfo.user_id"
            class="order-btn warning"
            @click.stop="updateStatus(orderInfo.order_id, 4)"
          > 确认完成</button>
        </template>
      </template>
      <button 
        class="order-btn primary"
        @click.stop="goChat(orderInfo)"
      >沟通</button>
    </view>
  </view>
</template>

<script>
import { orderApi } from '@/api/order'
import { messageApi } from '@/api/message.js';
export default {
  data() {
    return {
      order_id: '',
      orderInfo: {},
      userInfo: {},
      isBuyer: false, // 是否是买家
      isSeller: false, // 是否是卖家
      currentType:'',
      statusMap: {
        1: {
          text: '待确认',
          order_status: 'primary',
        },
        2: {
          text: '待自提',
          order_status: 'warning',
        },
        3: {
          text: '待收货',
          order_status: 'primary',
        },
        4: {
          text: '已完成',
          order_status: 'success',
        },
        5: {
          text: '已取消',
          order_status: 'error',
        }
      }
    }
  },
  onLoad(options) {
    this.order_id = options.order_id
    this.currentType = options?.currentType || ''
    this.userInfo = uni.getStorageSync('userInfo') || {}
    this.getOrderDetail()
  },
  methods: {
    // 获取订单详情
    async getOrderDetail() {
      try {
        const res = await orderApi.getOrderDetail({order_id: this.order_id || 49, user_id: this.userInfo.user_id || 9  })
        if (res.code === 200) {
          this.orderInfo = {
            ...res.data,
            imageUrl: res?.data?.image_url?.split(',')[0] || ''
          }
          // 判断身份：买家=当前用户是订单的buyer_id，卖家=seller_id
          this.isBuyer = this.orderInfo.buyer_id === this.userInfo.user_id
          this.isSeller = this.orderInfo.seller_id === this.userInfo.user_id
        }
      } catch (err) {
        console.error('获取详情失败', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
        uni.navigateBack()
      }
    },
    // 跳聊天页
    async goChat({ seller_id, order_id, opposite_nickname, user_id }) {
      const new_buy_id = this.currentType === 'sell' ? seller_id : user_id
      const new_seller_id = this.currentType === 'buy' ? seller_id : user_id
      // 调用接口获取 session_id
      const res = await messageApi.getSessionByUserPair({
        user1_id: new_buy_id,
        user2_id: new_seller_id
      });  
      if (res.code === 200 && res?.session_id) {        
        uni.navigateTo({ 
          url: `/pages/chat/chat?to_user_id=${new_seller_id}&order_id=${order_id}&nickname=${opposite_nickname}&session_id=${res.session_id}` 
        })
      } else {
        uni.showToast({ title: '获取会话失败', icon: 'none' })
      }
    },


    // 修改订单状态
    async updateStatus(order_id, order_status) {
      try {
        const { user_id = '' } = this.userInfo
        if (!user_id) return
        await orderApi.updateOrderStatus({order_id, order_status, user_id })
        uni.showToast({ title: '操作成功' })
        this.getOrderDetail()
      } catch (err) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    // 退单
    async refundOrder(order_id) {
      uni.showModal({
        title: '确认退单',
        content: '确定要取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            this.updateStatus(order_id, 5)
          }
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 10rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.status-box {
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  text-align: center;
}
.order-no {
  font-size: 24rpx;
  color: #999;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.card-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}
.info-row {
  font-size: 26rpx;
  color: #666;
  line-height: 44rpx;
  display: flex;
  justify-content: space-between;
}
.mt10 {
  margin-top: 10rpx;
}

.goods-card {
  padding-bottom: 20rpx;
}
.goods-box {
  display: flex;
  align-items: center;
}
.goods-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  background: #f2f2f2;
}
.goods-info {
  flex: 1;
  margin-left: 20rpx;
}
.goods-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}
.goods-price {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: bold;
}

// .status-tag {
//   padding: 4rpx 12rpx;
//   border-radius: 6rpx;
//   font-size: 22rpx;
// }
// .status-tag.normal {
//   background: #e6f7ff;
//   color: #1890ff;
// }
// .status-tag.ing {
//   background: #fff7e6;
//   color: #fa8c16;
// }
// .status-tag.gray {
//   background: #f5f5f5;
//   color: #999;
// }

/* 按钮区 */
.btn-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 30rpx;
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}
.order-btn {
  margin: 0;
  padding: 15rpx 40rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  background: #f2f3f5;
  color: #666;
  border: none;
  &.primary {
    background: #07c160;
    color: #fff;
  }
  &.warning {
    background: #efb240;
    color: #fff;
  }
}
.order-status {
  font-size: 26rpx;
  color: #1ea2f1;
  font-weight: 500;
  &.warning {
    color: #efb240;
  }
  &.error {
    color: #ff3b30;
  }
  &.success {
    color: #07c160;
  }
}

.price-red {
  color: #ff4d4f;
  font-weight: bold;
}
</style>