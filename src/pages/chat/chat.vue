<template>
  <view class="chat-page">
    <!-- 消息列表 -->
    <view class="msg-list" id="msg-list">
      <view 
        class="msg-item" 
        :class="{ 'self': item.sender_id === userInfo.user_id }"
        v-for="item in msgList" 
        :key="item.id"
      >
        <image 
          :src="item.sender_id === userInfo.user_id ? userInfo.avatarUrl : oppositeAvatar" 
          class="avatar"
        ></image>
        <view class="msg-content">
          <text class="msg-text">{{ item.content }}</text>
        </view>
      </view>
    </view>

    <view class="input-bar">
      <input 
        v-model="msgContent" 
        class="input" 
        placeholder="输入消息..."
        @confirm="sendMsg"
       />
      <button class="send-btn" @click="sendMsg">发送</button>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api/user.js';
import { messageApi } from '@/api/message.js';
export default {
  data() {
    return {
      to_user_id: '',
      order_id: '',
      nickname: '',
      msgContent: '',
      msgList: [],
      userInfo: {},
      oppositeAvatar: ''
    }
  },
  onLoad(options) {
    this.to_user_id = options.to_user_id
    this.order_id = options.order_id
    this.nickname = options.nickname
    this.userInfo = uni.getStorageSync('userInfo') || {}
    uni.setNavigationBarTitle({ title: this.userInfo?.nickname || '聊天' })
    this.getOppositeInfo()
    this.getMsgList()
    this.timer = setInterval(() => this.getMsgList(), 3000)
  },
  onUnload() {
    clearInterval(this.timer)
    this.markRead()
  },
  methods: {
    // 获取对方信息
    async getOppositeInfo() {
      try {
       const res = await userApi.getUserInfo({ user_id: this.to_user_id })
        if (res.code === 200) {
          this.oppositeAvatar = res.data.avatarUrl || 'https://picsum.photos/id/1005/100/100'
        }
      } catch (err) {}
    },
    // 获取消息列表
    async getMsgList() {
      try {
        const res = await messageApi.messageLists({
          user_id: this.userInfo.user_id,
          to_user_id: this.to_user_id,
          order_id: this.order_id 
        })
        if (res.code === 200) {
          this.msgList = res.data
          this.$nextTick(() => {
            const query = uni.createSelectorQuery().in(this)
            query.select('#msg-list').boundingClientRect()
            query.exec((res) => {
              if (res[0]?.height) {
                uni.pageScrollTo({ scrollTop: res[0].height, duration: 0 })
              }
            })
          })
        }
      } catch (err) {
        console.error('获取消息失败', err)
      }
    },
    // 发送消息
    async sendMsg() {
      if (!this.msgContent.trim()) return
      try {
        await messageApi.sendMessage({
          sender_id: this.userInfo.user_id,
          receiver_id: this.to_user_id,
          order_id: this.order_id,
          content: this.msgContent.trim()
        })
        this.msgContent = ''
        this.getMsgList()
      } catch (err) {
        uni.showToast({ title: '发送失败', icon: 'none' })
      }
    },
    // 标记已读
    async markRead() {
      try {
        await messageApi.markRead({
          user_id: this.userInfo.user_id,
          to_user_id: this.to_user_id,
          order_id: this.order_id 
        })
      } catch (err) {}
    }
  }
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f8fa;
}
/* 消息列表 */
.msg-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}
.msg-item {
  display: flex;
  margin-bottom: 20rpx;
  align-items: flex-start;
}
.msg-item.self {
  flex-direction: row-reverse;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin: 0 20rpx;
}
.msg-content {
  max-width: 60%;
  background: #fff;
  padding: 20rpx;
  border-radius: 16rpx;
  position: relative;
}
.msg-item.self .msg-content {
  background: #95ec69;
}
.msg-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}
/* 输入栏 */
.input-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
}
.input {
  flex: 1;
  background: #f0f0f0;
  border-radius: 40rpx;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
}
.send-btn {
  background: #07c160;
  color: #fff;
  border-radius: 40rpx;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  border: none;
}
</style>