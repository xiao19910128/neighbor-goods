<template>
  <div class="publish-page">
    <!-- 表单内容区 -->
    <div class="form-container">
      <!-- 商品图片上传 -->
      <div class="image-upload-section">
        <view class="upload-title">添加商品图片（最多9张）</view>
        <view class="upload-list">
          <!-- 已上传图片 -->
          <view 
            class="upload-item" 
            v-for="(item, index) in fileList" 
            :key="index"
            @click="handlePreview(item)"
          >
            <image :src="item.url" class="upload-img" mode="aspectFill" />
            <view class="upload-delete" @click.stop="handleDelete(index)">×</view>
          </view>
          <!-- 添加图片按钮 -->
          <view 
            class="upload-item upload-add" 
            v-if="fileList.length < 9"
            @click="handleChooseImage"
          >
            <view class="upload-add-icon">+</view>
          </view>
        </view>
      </div>

      <!-- 商品信息表单 -->
      <form class="product-form">
        <!-- 商品标题 -->
        <div class="form-group">
          <label class="form-label">商品标题</label>
          <input type="text" class="form-input" placeholder="请输入商品标题，清晰描述商品特点" />
        </div>

        <!-- 商品描述 -->
        <div class="form-group">
          <label class="form-label">商品描述</label>
          <textarea class="form-textarea" placeholder="请详细描述商品情况，包括品牌、型号、使用时间、成色等信息"></textarea>
        </div>

        <!-- 商品分类 -->
        <div class="form-group">
          <label class="form-label">商品分类</label>
          <select class="form-select">
            <option value="">请选择分类</option>
            <option value="digital">数码产品</option>
            <option value="clothes">服装鞋帽</option>
            <option value="home">家居用品</option>
            <option value="beauty">美妆护肤</option>
            <option value="other">其他分类</option>
          </select>
        </div>

        <!-- 商品价格 -->
        <div class="form-group price-group">
          <label class="form-label">商品价格</label>
          <div class="price-input-container">
            <span class="currency-symbol">¥</span>
            <input type="number" class="price-input" placeholder="0" />
          </div>
        </div>

        <!-- 商品状态 -->
        <div class="form-group">
          <label class="form-label">商品状态</label>
          <div class="status-options">
            <label class="status-option">
              <input type="radio" name="status" value="new" /> 全新未使用
            </label>
            <label class="status-option">
              <input type="radio" name="status" value="like-new" /> 几乎全新
            </label>
            <label class="status-option">
              <input type="radio" name="status" value="used" /> 轻微使用痕迹
            </label>
            <label class="status-option">
              <input type="radio" name="status" value="heavily-used" /> 明显使用痕迹
            </label>
          </div>
        </div>

        <!-- 交易方式 -->
        <div class="form-group">
          <label class="form-label">交易方式</label>
          <div class="trade-options">
            <label class="trade-option">
              <input type="checkbox" name="trade-type" value="online" /> 线上交易
            </label>
            <label class="trade-option">
              <input type="checkbox" name="trade-type" value="offline" /> 当面交易
            </label>
          </div>
        </div>
      </form>
    </div>
    <view>
      <uni-button type="primary" @click="handleSubmit">发布</uni-button>
    </view>

    <TabBar defaultTab="publish" />
  </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'

export default {
  name: 'PublishPage',
  components: {  TabBar },
  data() {
    return {
      fileList: [], // 存储已上传的图片信息，包括url和name等
    };
  },
  methods: {
    // 选择图片
    handleChooseImage  () {
      // 计算还能选几张
      const count = 9 - this.fileList.length;
      uni.chooseImage({
        count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          
          // 模拟上传到服务器（替换为你的真实上传接口）
          tempFilePaths.forEach((path) => {
            // 这里可以调用 uni.uploadFile 上传到服务器
            // 上传成功后，将返回的 url 存入 fileList
            this.fileList.push({
              url: path, // 这里先用本地路径，实际项目应替换为服务器返回的 url
              name: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            });
          });
        },
        fail: (err) => {
          console.error('选择图片失败：', err);
          uni.showToast({ title: '选择图片失败', icon: 'none' });
        }
      });
    },
    /**
     * 提交图片数据到服务器的方法
     */
    async handleSubmit() {
      // 1. 校验是否选择图片
      if (this.fileList.length === 0) {
        uni.showToast({ title: '请至少选择1张图片', icon: 'none' });
        return;
      }

      // 2. 标记提交中
      this.submitting = true;

      try {
        // 3. 遍历图片，上传本地临时图片到服务器
        const imageUrls = [];
        for (const item of this.fileList) {
          // 判断是否为本地临时路径（小程序临时路径以 tmp/ 开头）
          if (item.url.includes('tmp/')) {
            const serverUrl = await this.uploadToServer(item.url);
            imageUrls.push(serverUrl);
          } else {
            imageUrls.push(item.url);
          }
        }

        // 4. 提交图片URL到后端接口
        const res = await uni.request({
          url: 'https://你的服务器地址/submit',
          method: 'POST',
          data: { images: imageUrls }
        });

        // 5. 处理提交结果
        if (res.data.code === 200) {
          uni.showToast({ title: '提交成功', icon: 'success' });
          this.fileList = []; // 清空图片列表
        } else {
          uni.showToast({ title: res.data.msg, icon: 'none' });
        }
      } catch (err) {
        // 6. 捕获异常
        console.error('提交失败：', err);
        uni.showToast({ title: '提交失败，请重试', icon: 'none' });
      } finally {
        // 7. 重置提交状态
        this.submitting = false;
      }
    },

    // 上传图片到服务器
    uploadToServer(tempFilePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: 'https://你的服务器地址/upload', // 后端上传接口
          filePath: tempFilePath,
          name: 'file', // 后端接收文件的字段名
          success: (res) => {
            const data = JSON.parse(res.data);
            if (data.code === 200) {
              resolve(data.url); // 返回服务器返回的图片URL
            } else {
              reject(new Error(data.msg));
            }
          },
          fail: reject
        });
      });
    },

    // 删除已上传图片
    handleDelete  (index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这张图片吗？',
        success: (res) => {
          if (res.confirm) {
            this.fileList.splice(index, 1);
          }
        }
      });
    },
    // 预览图片
    handlePreview  (current) {
      const urls = this.fileList.map(item => item.url);
      uni.previewImage({
        urls,
        current: current.url
      });
    },
  }
};
</script>

<style scoped>
/* 基础布局 */
.publish-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90rpx);
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  background-color: #fbeaea;
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.submit-btn {
  font-size: 16px;
  color: #ff4400;
  font-weight: bold;
  cursor: pointer;
}

/* 表单内容区 */
.form-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

/* 图片上传区域 */
.image-upload-section {
  margin-bottom: 20px;
}

.upload-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.image-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.add-image-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.uploaded-image {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0,0,0,0.5);
  color: #fff;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

/* 表单样式 */
.product-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-input, .form-textarea, .form-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.price-group {
  position: relative;
}

.price-input-container {
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 10px;
  top: 35px;
  font-size: 14px;
  color: #333;
}

.price-input {
  padding-left: 25px;
  width: 100%;
}

.status-options, .trade-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.status-option, .trade-option {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #333;
}

.status-option input, .trade-option input {
  margin: 0;
}


.upload-container {
  padding: 20rpx;
}

.upload-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.upload-item {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}

.upload-img {
  width: 100%;
  height: 100%;
}

.upload-delete {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  font-size: 24rpx;
}

.upload-add {
  border: 2rpx dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-add-icon {
  font-size: 48rpx;
  color: #ccc;
}
</style>