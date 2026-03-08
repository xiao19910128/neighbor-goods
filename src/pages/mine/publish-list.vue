<template>
  <view class="publish-item" v-for="item in publishList" :key="item.id">
    <view class="item-title">{{ item.name }}</view>
    <view class="item-price">¥{{ item.price }}</view>
    <!-- 审核状态展示 -->
    <view class="audit-status" :class="item.audit_status === 0 ? 'pending' : (item.audit_status === 1 ? 'success' : 'fail')">
      {{ item.audit_status === 0 ? '待审核' : (item.audit_status === 1 ? '审核通过' : '审核拒绝：' + item.audit_remark) }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      publishList: [
        { id: 1, name: '商品A', price: 100, audit_status: 0 },
        { id: 2, name: '商品B', price: 200, audit_status: 1 },
        { id: 3, name: '商品C', price: 300, audit_status: -1, audit_remark: '价格过高' }
      ]
    }
  }
}
</script>

<style>
.audit-status.pending { color: #ff9900; }
.audit-status.success { color: #00cc66; }
.audit-status.fail { color: #ff3333; }
</style>