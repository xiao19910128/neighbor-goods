<template>
  <view class="publish-page">
    <view class="form-container">
      <!-- 商品图片上传 -->
      <view class="form-item" style="display: none">
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
      </view>

      <!-- 商品标题 -->
      <view class="form-item">
        <text class="label">商品标题</text>
        <input v-model="form.name" placeholder="请输入商品标题" />
      </view>

      <!-- 商品价格 -->
      <view class="form-item">
        <text class="label">价格（元）</text>
        <input v-model.number="form.price" type="number" placeholder="0.00" />
      </view>

      <!-- 平铺分类选择 -->
      <view class="form-item">
        <text class="label">商品分类</text>
        <view class="category-list">
          <view
            v-for="cat in categoryList"
            :key="cat.category_id"
            :class="['category-item', { active: form.categoryId === cat.category_id }]"
            @click="selectCategory(cat.category_id)"
          >
            {{ cat.name }}
          </view>
        </view>
      </view>

      <!-- 商品描述（包含成色/品牌等信息） -->
      <view class="form-item">
        <text class="label">商品描述（可填写成色、品牌、使用情况等）</text>
        <textarea v-model="form.desc" placeholder="例如：99新小米14，全套配件，无拆无修..." />
      </view>
    </view>

    <!-- 发布按钮 -->
    <view class="footer-box">
      <uni-button class="publish-btn" @click="publishGoods">发布闲置</uni-button>
    </view>

    <TabBar defaultTab="publish" />
  </view>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import { goodsApi } from '@/api/goods';
import { categoryApi } from '@/api/category';

export default {
  name: 'PublishPage',
  components: {  TabBar },
  data() {
    return {
      categoryList: [], // 分类列表
      fileList: [], // 存储已上传的图片信息，包括url和name等
      form: {
        name: 'namename',
        price: 10,
        categoryId: null, // 选中的分类ID
        desc: 'descdesc'
      }
    };
  },
  async onLoad() {
    // 加载分类列表
    await this.loadCategories();
  },
  methods: {
    // 加载分类列表
    async loadCategories() {
      try {
        const res = await categoryApi.getCategoryList();
        if (res?.code === 200) {
          this.categoryList = res?.data;
        }
      } catch (err) {
        uni.showToast({ title: '加载分类失败', icon: 'none' });
      }
    },
    // 选择分类
    selectCategory(id) {
      this.form.categoryId = id;
    },
    // 发布商品
    async publishGoods() {
      // 简单校验
      if (!this.form.name) return uni.showToast({ title: '请输入商品标题', icon: 'none' });
      if (!this.form.price) return uni.showToast({ title: '请输入商品价格', icon: 'none' });
      if (!this.form.categoryId) return uni.showToast({ title: '请选择商品分类', icon: 'none' });

      try {
        console.log(11, this.form.name, this.form.price, this.form.categoryId, this.form.desc);
        
        const publisgRes = await goodsApi.publishGoods({
          name: this.form.name,
          price: this.form.price,
          category_id: this.form.categoryId,
          description: this.form.desc,
          image_urls: this.fileList.map(item => item.url),
          user_id: uni.getStorageSync('userId') || 2 // TODO 这里待拿到用户登录信息
        });
        
        if (publisgRes?.code === 200) {
          uni.showToast({ title: '发布成功', icon: 'success' });
          // 重置表单
          this.form = { name: '', price: 0, categoryId: null, desc: '' };
        } else {
          uni.showToast({ title: publisgRes.msg, icon: 'none' });
        }
      } catch (err) {
        uni.showToast({ title: '发布失败', icon: 'none' });
      }
    },
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
   
  }
};
</script>

<style scoped lang="scss">

/* 基础布局 */
.publish-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90rpx);
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
/* 表单内容区 */
.form-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
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

.form-item {
  margin: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 8rpx;
}
.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}
input, textarea {
  width: 100%;
  padding: 15rpx;
  border: 1px solid #eee;
  border-radius: 6rpx;
  font-size: 26rpx;
}
textarea {
  min-height: 200rpx;
  resize: none;
}
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  margin-top: 10rpx;
}
.category-item {
  padding: 12rpx 24rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
}
.category-item.active {
  background: #d6e9c6;
  color: #3c763d;
}

.footer-box {
  display: flex;
  padding: 10px 0;
  // background-color: rgb(206, 236, 157);
  uni-button {
    flex: 1;
    text-align: center;
    font-weight: bolder;
  }
}
.publish-btn {
  margin: 40rpx 20rpx;
  background: #5cb85c;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  padding: 24rpx;
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
</style>