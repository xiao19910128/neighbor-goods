<template>
  <view class="edit-page">
    <view class="form-item">
      <text class="label">联系人</text>
      <input class="input" v-model="addressForm.contact_name" placeholder="请输入联系人" />
    </view>

    <view class="form-item">
      <text class="label">联系电话</text>
      <input class="input" v-model="addressForm.contact_phone" placeholder="请输入联系电话" type="number" />
    </view>
    
    <view class="form-item">
      <picker :range="streetList" @change="handleStreetChange">
        <view class="picker-text">当前社区：{{ addressForm.streetName }}</view>
      </picker>
    </view>

    <view class="form-item">
      <text class="label">详细地址</text>
      <input class="input" v-model="addressForm.detail_address" placeholder="请输入详细地址（小区/楼栋/门牌号）" />
    </view>

    <view class="form-item checkbox-row">
      <checkbox-group @change="onDefaultChange">
        <label>
          <checkbox value="1" :checked="addressForm.is_default == 1" />
          <text>设为默认地址</text>
        </label>
      </checkbox-group>
    </view>

    <button class="save-btn" @click="save">保存地址</button>
  </view>
</template>

<script>
import { addressApi } from '@/api/address.js'

export default {
  data() {
    return {
      addressForm: {
        address_id: 0,
        contact_name: '',
        contact_phone: '',
        province: '上海市',
        city: '上海市',
        district: '闵行区',
        detail_address: '',
        is_default: 0,
        street: '梅陇镇',
        streetName: '梅陇镇'
      },
      streetList: ['梅陇镇','莘庄镇', '七宝镇', '颛桥镇', '华漕镇', '虹桥镇', '吴泾镇', '马桥镇', '浦江镇', '江川路街道', '古美街道', '新虹街道', '浦锦街道', '莘庄工业区'], // 街道列表
    }
  },

  onLoad(options) {    
    if (options.address) {
      let addr = JSON.parse(decodeURIComponent(options.address))
      this.addressForm = addr
    }
  },

  methods: {
    onDefaultChange(e) {
      this.addressForm.is_default = e.detail.value.length ? 1 : 0
    },

    async save() {
      const user = uni.getStorageSync('userInfo')
      if (!user || !user.user_id) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        setTimeout(() => {
          uni.navigateTo({ url: '/pages/login/index' })
        }, 300)
        return
      }
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(this.addressForm?.contact_phone)) {
        uni.showToast({
          title: '请输入正确的11位手机号',
          icon: 'none'
        })
        return
      }
      const params = {
        ...this.addressForm,
        user_id: user.user_id
      }
      try {
        if (this.addressForm.address_id) {
          await addressApi.updateAddress(params)
          uni.showToast({ title: '修改成功', icon: 'none' })
        } else {
          await addressApi.addAddress(params)
          uni.showToast({ title: '添加成功', icon: 'none' })
        }

        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      } catch (err) {
        console.error('❌ 保存失败：', err)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    },


    // 2. 处理街道/社区变化
    handleStreetChange(e) {
      this.addressForm.street = this.streetList[e.detail.value];
      this.addressForm.streetName = this.addressForm.street;
    },
  }
}
</script>

<style scoped>
.edit-page {
  padding: 30rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.form-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.input {
  height: 70rpx;
  font-size: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.checkbox-row {
  display: flex;
  align-items: center;
  padding: 30rpx;
}

.save-btn {
  background: #07c160;
  color: #fff;
  border-radius: 12rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}
</style>