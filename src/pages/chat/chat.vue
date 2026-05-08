<template>
  <view class="chat-page">
    <!-- 消息列表 -->
    <view class="msg-list" id="msg-list">
      <view 
        class="msg-item" 
        :class="{ 'self': item.sender_id === userInfo.user_id }"
        v-for="item in messageList" 
        :key="item.id"
      >
        <image 
          :src="item.sender_id === userInfo.user_id ? (userInfo.avatarUrl || '/static/default-avatar.png') : oppositeAvatar" 
          class="avatar"
        ></image>
        <view class="msg-content" v-if="item.msg_type === 0">
          <text class="msg-text">{{ item.content }}</text>
        </view>
        <!-- 图片消息 -->
        <image class="chat-image" v-else-if="item.msg_type === 1" :src="item.content"  mode="widthFix" crossorigin="anonymous" @click="previewImage(item.content)" />

      </view>
    </view>
    <!-- 聊天页底部输入栏 -->
    <view class="input-bar">
      <input 
        v-model="msgContent" 
        class="input" 
        placeholder="输入消息..."
        @confirm="sendMsg"
      />
      <button v-if="!msgContent" class="choose-image-btn common-send-btn" @click="chooseImage">+</button>
      <button v-else class="send-btn common-send-btn" @click="sendMsg">发送</button>
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
      messageList: [],
      userInfo: {},
      oppositeAvatar: '',
      session_id: '',   
      timer: null
    }
  },
  onLoad(options) {
    this.session_id = options.session_id;
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
        const res = await messageApi.getHistoryMsg({
          user_id: this.userInfo.user_id,
          session_id: this.session_id
        })
        if (res.code === 200) {
          this.messageList = res.data
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
    async sendMsg(msg_type='text', imageUrl = '') {
      const msgContent = this.msgContent.trim()
      if (!msgContent && msg_type ==='text') return
      try {
        await messageApi.sendMessage({
          session_id: this.session_id,
          sender_id: this.userInfo.user_id,
          receiver_id: this.to_user_id,
          order_id: this.order_id,
          content: msg_type === 'image' ? imageUrl : this.msgContent.trim(),
          msg_type: msg_type === 'image' ? 1: 0 // 新增一个字段：1=图片，0=文本
        })
        this.msgContent = ''
        // this.messageList.push(msgContent);
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
          order_id: this.order_id  || null
        })
      } catch (err) {}
    },
    // 选择图片（拍照/相册）
    chooseImage() {
      uni.chooseImage({
        sizeType: ['compressed'], // 压缩图片
        sourceType: ['album', 'camera'], // 支持相册和拍照
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.uploadImage(tempFilePath);
        }
      });
    },

    // 上传图片到后端
    async uploadImage(filePath) {
      uni.showLoading({ title: '发送中...' });
      return new Promise((resolve) => {
        uni.uploadFile({
          url: 'http://192.168.3.121:3000/api/upload/chatImage',
          filePath: filePath,
          name: 'file',
          success: (uploadRes) => {
            try {
              const data = JSON.parse(uploadRes.data);
              if (data?.code === 200) {
                const url = typeof data.data === 'string' ? data.data : data.data?.url;
                // 上传成功，把图片地址发成消息
                this.sendMsg('image', url);
                resolve(url || null);
              } else {
                resolve(null);
              }
            } catch (e) {
              resolve(null);
            }
          },
          fail: () => {
            uni.showToast({ title: '上传失败', icon: 'none' });
          },
          complete: () => {
            uni.hideLoading();
          }
        });
      })
    },   
    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url
      });
    },
    // 批量预览--有点bug，暂时不用了
    previewImage1(url) {
      // 取出当前聊天所有图片
      const allImages = this.messageList
        ?.filter(item => item.msg_type === 1 && item.content)
        ?.map(item => item.content) || [];

      if (allImages.length === 0) return;

      // 直接预览！
      uni.previewImage({
        urls: allImages,
        current: url,
        loop: true
      });
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
.chat-image {
  width: 160rpx;
  height: 160rpx;
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
.common-send-btn {
  width: 120rpx;
    height: 90rpx;
    color: #fff;
    font-size: 30rpx;
    text-align: center;
    line-height: 90rpx;
    border-radius: 40rpx;
    background: #07c160;
}
.choose-image-btn {
    margin-right: 20rpx;
    font-weight: bolder;
    font-size: 60rpx;
}
</style>