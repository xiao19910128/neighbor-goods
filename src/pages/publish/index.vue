<template>
  <view class="publish-page">
    <view class="form-container">
      <!-- 商品图片上传 -->
      <view class="form-item">
        <view class="upload-title">添加商品图片（最多9张）</view>
        <view class="upload-list">
          <!-- 已上传图片 -->
          <view 
            class="upload-item" 
            v-for="(item, index) in fileList" 
            :key="index"
            @click="handlePreview(item, index)"
          >
            <image :src="item" class="upload-img" mode="aspectFill" crossorigin="anonymous" />
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

       <!-- 地址区域配置 -->
      <view class="address-section form-item">
        <!-- 1. 省市区三级联动（这里可以用 uni-ui 的 ui-picker 或自定义组件） -->
        <picker mode="region" :value="regionValue" @change="handleRegionChange">
          <view class="picker-text">{{ regionText }}</view>
        </picker>

        <!-- 2. 街道/社区选择（默认是你的目标社区） -->
        <picker :range="streetList" @change="handleStreetChange">
          <view class="picker-text">当前社区：{{ streetName }}</view>
        </picker>

        <!-- 3. 详细地址（精确到小区/门口） -->
        <input 
          placeholder="请输入详细地址（如：阳光花园3栋）" 
          v-model="form.detail_address" 
        />
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
        desc: 'descdesc',
        province: '',
        city: '',
        district: '',
        street: '',
        detail_address: ''
      },

      // 省市区联动
      regionValue: [],
      regionText: '',
      // 街道列表（可以根据 district 动态加载）
      streetList: ['梅陇镇', '吴泾镇', '颛桥镇', '华漕镇'], 
      streetName: '请选择社区',
      streetId: ''
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
          image_url: this.fileList?.join(','),
          user_id: uni.getStorageSync('userId') || 2 // TODO 这里待拿到用户登录信息
        });
        
        if (publisgRes?.code === 200) {
          uni.showToast({ title: '发布成功', icon: 'success' });
          // 重置表单
          this.form = { name: '', price: 0, categoryId: null, desc: '' };

          // 跳转到我的发布列表
          wx.navigateTo({ url: '/pages/mine/publish-list' });
        } else {
          uni.showToast({ title: publisgRes.msg, icon: 'none' });
        }
      } catch (err) {
        uni.showToast({ title: '发布失败', icon: 'none' });
      }
    },
     // 选择图片
    async handleChooseImage  () {
      try {
        // 计算还能选几张
        const count = 9 - this.fileList.length;
        const res = await uni.chooseImage({
          count,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
        });
        console.log(99999, res.tempFilePaths);
        
        // 遍历选中的图片，逐个上传
        for (const tempFilePath of res.tempFilePaths) {
          const uploadFiles =  await this.uploadImageToServer(tempFilePath);
          // 上传成功后，把 URL 加入 fileList
          console.log(132424345, uploadFiles);
          
          this.fileList = [...this.fileList, uploadFiles]; // 推荐用新数组赋值，触发更新
        }
      } catch (err) {
        uni.showToast({ title: '选择图片失败', icon: 'none' });
      }
    },
    // 上传图片到 kstore
    uploadImageToServer(tempFilePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: 'http://localhost:5173/api/upload/image', 
          filePath: tempFilePath,
          name: 'file',
          success: (uploadRes) => {
            const data = JSON.parse(uploadRes.data);
            if (data.code === 200) {
              // 直接使用后端返回的公共 URL，不需要替换
              resolve(data.data.url);
            } else {
              uni.showToast({ title: data.message, icon: 'none' });
              reject();
            }
          },
          fail: (err) => {
            uni.showToast({ title: '图片上传失败', icon: 'none' });
            reject(err);
          }
        });
      });
    },

    // 图片预览核心方法
    handlePreview(currentImg, currentIndex) {
      // 调用 uni-app 原生预览图片 API
      uni.previewImage({
        current: currentIndex,  // 当前预览图片的索引
        urls: this.fileList,    // 所有可预览的图片 URL 数组
        loop: true,             // 支持循环预览
        longPressActions: {     // 长按图片操作（可选）
          itemList: ['保存图片', '取消'],
          success: (res) => {
            if (res.tapIndex === 0) {
              // 保存图片到本地
              uni.saveImageToPhotosAlbum({
                filePath: currentImg,
                success: () => {
                  uni.showToast({ title: '保存成功', icon: 'success' });
                },
                fail: () => {
                  uni.showToast({ title: '保存失败', icon: 'none' });
                }
              });
            }
          }
        }
      });
    },

    // 1. 处理省市区变化
    handleRegionChange(e) {
      const { code, value } = e.detail;
      this.form.province = value[0];
      this.form.city = value[1];
      this.form.district = value[2];
      this.regionText = value.join('');
    },

    // 2. 处理街道/社区变化
    handleStreetChange(e) {
      this.form.street = this.streetList[e.detail.value];
      this.streetName = this.form.street;
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