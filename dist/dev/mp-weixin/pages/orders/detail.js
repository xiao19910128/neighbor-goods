"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_https = require("../../utils/https.js");
const _sfc_main = {
  data() {
    return {
      order_id: "",
      orderInfo: {},
      userInfo: {},
      isBuyer: false,
      // 是否是买家
      isSeller: false
      // 是否是卖家
    };
  },
  onLoad(options) {
    this.order_id = options.order_id;
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.getOrderDetail();
  },
  methods: {
    // 获取订单详情
    async getOrderDetail() {
      try {
        const res = await utils_https.service({
          url: "/api/order/detail",
          method: "POST",
          data: {
            order_id: this.order_id,
            user_id: this.userInfo.user_id
          }
        });
        if (res.code === 200) {
          this.orderInfo = res.data;
          this.isBuyer = this.orderInfo.buyer_id === this.userInfo.user_id;
          this.isSeller = this.orderInfo.seller_id === this.userInfo.user_id;
        }
      } catch (err) {
        console.error("获取详情失败", err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        common_vendor.index.navigateBack();
      }
    },
    // 跳聊天页
    goChat(toUserId, orderId, nickname) {
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?to_user_id=${toUserId}&order_id=${orderId}&nickname=${nickname}`
      });
    },
    // 订单状态文字
    getStatusText(status) {
      const map = { 1: "待确认", 2: "待交割", 3: "待收货", 4: "已完成", 5: "已取消" };
      return map[status] || "未知";
    },
    // 确认交易（卖家）
    async confirmOrder(order_id) {
      try {
        await utils_https.service({
          url: "/api/order/updateStatus",
          method: "POST",
          data: { order_id, status: 2, user_id: this.userInfo.user_id }
        });
        common_vendor.index.showToast({ title: "确认成功", icon: "none" });
        this.getOrderDetail();
      } catch (err) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    },
    // 确认完成（买家）
    async confirmFinish(order_id) {
      try {
        await utils_https.service({
          url: "/api/order/updateStatus",
          method: "POST",
          data: { order_id, status: 4, user_id: this.userInfo.user_id }
        });
        common_vendor.index.showToast({ title: "确认完成", icon: "none" });
        this.getOrderDetail();
      } catch (err) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    },
    // 取消订单
    async cancelOrder(order_id) {
      try {
        await utils_https.service({
          url: "/api/order/updateStatus",
          method: "POST",
          data: { order_id, status: 5, user_id: this.userInfo.user_id }
        });
        common_vendor.index.showToast({ title: "取消成功", icon: "none" });
        this.getOrderDetail();
      } catch (err) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.getStatusText($data.orderInfo.status)),
    b: $data.orderInfo.image_url,
    c: common_vendor.t($data.orderInfo.name),
    d: common_vendor.t($data.orderInfo.price),
    e: common_vendor.t($data.orderInfo.order_sn),
    f: common_vendor.t($data.orderInfo.created_time),
    g: common_vendor.t($data.orderInfo.trade_address || "待协商"),
    h: common_vendor.t($data.orderInfo.trade_time || "待协商"),
    i: common_vendor.t($data.isBuyer ? "卖家" : "买家"),
    j: common_vendor.t($data.orderInfo.opposite_nickname),
    k: common_vendor.t($data.orderInfo.opposite_phone || "沟通后可见"),
    l: common_vendor.o(($event) => $options.goChat($data.orderInfo.opposite_user_id, $data.orderInfo.order_id, $data.orderInfo.opposite_nickname)),
    m: $data.isSeller && $data.orderInfo.status === 1
  }, $data.isSeller && $data.orderInfo.status === 1 ? {
    n: common_vendor.o(($event) => $options.confirmOrder($data.orderInfo.order_id))
  } : {}, {
    o: $data.isBuyer && $data.orderInfo.status === 3
  }, $data.isBuyer && $data.orderInfo.status === 3 ? {
    p: common_vendor.o(($event) => $options.confirmFinish($data.orderInfo.order_id))
  } : {}, {
    q: $data.orderInfo.status !== 4 && $data.orderInfo.status !== 5
  }, $data.orderInfo.status !== 4 && $data.orderInfo.status !== 5 ? {
    r: common_vendor.o(($event) => $options.cancelOrder($data.orderInfo.order_id))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9f5624b7"]]);
wx.createPage(MiniProgramPage);
