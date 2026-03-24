<template>
  <view class="edit-page">
    <view class="form-item">
      <text class="label">收货人</text>
      <input class="input" v-model="addressForm.name" placeholder="请输入姓名" />
    </view>

    <view class="form-item">
      <text class="label">手机号码</text>
      <input class="input" v-model="addressForm.phone" placeholder="请输入手机号" type="number" />
    </view>

    <view class="form-item">
      <text class="label">详细地址</text>
      <input class="input" v-model="addressForm.detail" placeholder="请输入详细地址（小区/楼栋/门牌号）" />
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
        name: '',
        phone: '',
        province: '上海市',
        city: '上海市',
        county: '闵行区',
        detail: '',
        is_default: 0
      }
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
        return
      }
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(this.addressForm.phone)) {
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
    }
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