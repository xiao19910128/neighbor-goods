<template>
  <view class="publish-page">
    <!-- 未登录 -->
    <view v-if="!isLogin" class="no-login">
      <view class="login-tip">还没有登录，请先登录</view>
      <button class="btn-login" @click="uni.navigateTo({ url: '/pages/login/index' })">登录</button>
    </view>
    <!-- 已登录--可发布闲置 -->
    <view v-else class="main-publish">
      <view class="form-container">
        <!-- 商品图片上传 -->
        <view class="form-item">
          <view class="upload-title">添加商品图片（最多9张）</view>
          <view class="upload-list">
            <!-- 已上传图片 -->
            <view 
              class="upload-item" 
              v-for="(item, index) in goodsImages" 
              :key="index"
              @click.stop="handlePreview(item, index)"
            >
              <image :src="item" class="upload-img" mode="aspectFill" crossorigin="anonymous" />
              <view class="upload-delete" @click.stop="handleDelete(index)">×</view>
            </view>
            <!-- 添加图片按钮 -->
            <view 
              class="upload-item upload-add" 
              v-if="goodsImages.length < 9"
              @click.stop="handleChooseImage"
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

          <!-- 2. 街道/社区选择（默认是你的目标社区） -->
          <picker :range="streetList" @change="handleStreetChange">
            <view class="picker-text">当前社区：{{ form.streetName }}</view>
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
              :class="['category-item', { active: form.category_id === cat.category_id }]"
              @click.stop="selectCategory(cat.category_id)"
            >
              {{ cat.name }}
            </view>
          </view>
        </view>

        <!-- 商品描述（包含成色/品牌等信息） -->
        <view class="form-item">
          <text class="label">商品描述（可填写成色、品牌、使用情况等）</text>
          <textarea v-model="form.description" placeholder="例如：99新小米14，全套配件，无拆无修..." />
        </view>
      </view>
      <view class="footer-box">
        <button class="publish-btn" @click.stop="publishGoods">发布闲置</button>
      </view>
    </view>
    <TabBar defaultTab="publish" />
  </view>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import { goodsApi } from '@/api/goods';
import { categoryApi } from '@/api/category';
const initialData = {
  price: '',
  category_id: null, // 选中的分类ID
  description: '',
  province: '',
  city: '',
  name: '',
  district: '',
  street: '梅陇镇',
  detail_address: '',
  streetName: '梅陇镇',
};
export default {
  name: 'PublishPage',
  components: {  TabBar },
  data() {
    return {
      categoryList: [], // 分类列表
      goodsImages: [], // 存储已上传的图片信息
      form: { ...initialData},
      // 省市区联动
      regionValue: ['上海市', '上海市', '闵行区'],
      // 街道列表（可以根据 district 动态加载）
      streetList: ['梅陇镇', '吴泾镇', '颛桥镇', '华漕镇'], 
      streetId: '',
      goodsId: '', // 编辑模式下，商品的ID
      isLogin: !!uni.getStorageSync('token'),
      userInfo: {}, // 用户信息
    };
  },
  
  async onShow() {
    // 加载分类列表
    await this.loadCategories();
    // 从登录页返回时需要更新token状态，重新判断是否登录
    this.isLogin = !!uni.getStorageSync('token');
    this.userInfo = uni.getStorageSync('userInfo') || {};
  },
  async onLoad(options = {}) {
    this.form = { ...initialData };
    // 从路由获取 goods_id
    if (options.goods_id) {
      this.goodsId = options.goods_id;
      this.getGoodsDetail(this.goodsId);
    }
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
      this.form.category_id = id;
    },
    // 发布商品
    async publishGoods() {
      // 简单校验
      if (!this.form.name) return uni.showToast({ title: '请输入商品标题', icon: 'none' });
      if (!this.form.price) return uni.showToast({ title: '请输入商品价格', icon: 'none' });
      if (!this.form.category_id) return uni.showToast({ title: '请选择商品分类', icon: 'none' });
      if (!this.form.street) return uni.showToast({ title: '请选择社区信息', icon: 'none' });
      try {
        const params = {
          ...this.form,
          image_url: this.goodsImages?.join(','),
          user_id: this.userInfo?.user_id
        }
        let publishRes = null;        
        if (this.goodsId) {
          // 编辑模式：调用更新接口
          publishRes = await goodsApi.updateGoods({
            ...params,
            goods_id: this.goodsId
          });
        } else {
          // 发布模式：调用发布接口
          publishRes = await goodsApi.publishGoods(params);
        }        
        if (publishRes?.code === 200) {
          uni.showToast({ title: '商品信息提交成功', icon: 'none' });
          // 重置表单
          this.form = { name: '', price: 0, category_id: null, description: '' };
          // 跳转到我的发布列表
          wx.navigateTo({ url: '/pages/mine/publish-list?from=publish' });
        } else {
          uni.showToast({ title: publishRes.msg, icon: 'none' });
        }
      } catch (err) {
        // 异常状态提示信息--账户禁用等
        uni.showToast({ title:  err?.message || err?.msg, icon: 'none' });
      }
    },
    
    // 查询闲置详情
    async getGoodsDetail(goodsId) {
      try {
        const res = await goodsApi.getGoodsDetail({ goods_id: goodsId });
        const {data, code} = res
        if (code === 200) {
          // 回填表单数据
          this.form = {
            ...data,
            // streetName: 
          };
          this.goodsImages = data?.image_url?.split(',')
          // 页面标题改为“编辑闲置”
          uni.setNavigationBarTitle({ title: '编辑闲置' });
          // 按钮文字改为“更新闲置”
          this.btnText = '更新闲置';
          // this.form = { ...initialData };
        }
      } catch (err) {
        uni.showToast({ title: '获取商品详情失败', icon: 'none' });
      }
    },
    // 选择图片// 选择图片 + 批量上传完整方法（直接复制到发布页）
    async handleChooseImage() {
      try {
        // 1. 选择图片（最多9张）
        const res = await uni.chooseImage({
          count: 9, // 最多9张，和你页面提示一致
          sizeType: ['compressed'], // 压缩图片，减少上传体积
          sourceType: ['album', 'camera'] // 允许相册/相机
        });

        const tempFilePaths = res.tempFilePaths;
        // 2. 批量上传所有图片
        const uploadTasks = tempFilePaths.map(path => this.uploadImage(path));
        const imageUrls = await Promise.all(uploadTasks);

        // 过滤掉上传失败的null
        this.goodsImages = imageUrls.filter(url => url !== null);
        uni.showToast({
          title: `成功上传${this.goodsImages.length}张图片`,
          icon: 'none'
        });
      } catch (err) {
        console.error('选择/上传图片失败:', err);
        uni.showToast({
          title: '图片操作失败',
          icon: 'none'
        });
      }
    },

    // 上传图片方法（完全适配微信小程序/uni-app，直接复制）
async uploadImage(tempFilePath) {
  try {
    const res = await uni.uploadFile({
      url: 'http://localhost:3000/api/upload/image',
      filePath: tempFilePath, // 选择图片后返回的临时路径
      name: 'file',
      formData: {
        user_id: uni.getStorageSync('userInfo').user_id
      },
      timeout: 10000  // 超时时间
    });

    // uni.uploadFile返回的data是JSON字符串，须手动解析
    const data = JSON.parse(res?.data);
    if (data?.code === 200) {
      uni.showToast({
        title: '上传成功',
        icon: 'none',
        duration: 1500
      });
      // 返回图片URL，给商品表单使用
      return data?.data?.url;
    } else {
      uni.showToast({
        title: data?.message || '上传失败',
        icon: 'none',
        duration: 2000
      });
      return null;
    }
  } catch (err) {
    uni.showToast({
      title: '上传失败，请重试',
      icon: 'none',
      duration: 2000
    });
    return null;
  }
},

    // 上传图片到服务器
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
        urls: this.goodsImages,    // 所有可预览的图片 URL 数组
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
    // 删除图片
    handleDelete(index) {
      this.goodsImages.splice(index, 1);
    },
    async getUserLocation() {
      try {
        // 不管是浏览器还是真机，都直接固定为梅陇镇
        this.regionValue = ['上海市', '上海市', '闵行区'];
        this.detailAddress = '请输入小区/楼栋';
        uni.showToast({ title: '已定位到梅陇镇（社区默认）', icon: 'none' });
      } catch (err) {
        uni.showToast({ title: '定位失败，默认选择梅陇镇', icon: 'none' });
          uni.hideLoading();
        }
    },


    // 1. 处理省市区变化
    handleRegionChange(e) {
      const { code, value } = e.detail;
      this.form.province = value[0];
      this.form.city = value[1];
      this.form.district = value[2];
    },

    // 2. 处理街道/社区变化
    handleStreetChange(e) {
      this.form.street = this.streetList[e.detail.value];
      this.form.streetName = this.form.street;
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
  width: 100%;
  margin: 20rpx;
  background: #5cb85c;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  padding: 15rpx;
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


.no-login {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login-tip {
    color: #999;
    margin-bottom: 20rpx;
  }
}
.main-publish {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>