"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userInfo: common_vendor.index.getStorageSync("userInfo") || {},
      currentType: "buy",
      // buy 我买到的 | sell 我卖出的
      list: [],
      statusMap: {
        1: {
          text: "待确认",
          status: "primary"
        },
        2: {
          text: "待自提",
          status: "warning"
        },
        3: {
          text: "待收货",
          status: "primary"
        },
        4: {
          text: "已完成",
          status: "success"
        },
        5: {
          text: "已取消",
          status: "error"
        }
      }
    };
  },
  methods: {
    switchTab(tab) {
      this.currentType = tab;
      this.getList();
    },
    // 获取订单列表
    async getList() {
      var _a;
      const { user_id = "" } = this.userInfo;
      if (!user_id)
        return;
      const res = await api_order.orderApi.getOrderList({ user_id, type: this.currentType });
      if (res.code === 200) {
        this.list = (_a = res.data) == null ? void 0 : _a.map((item) => {
          var _a2;
          return {
            ...item,
            images: ((_a2 = item == null ? void 0 : item.image_url) == null ? void 0 : _a2.split(",")) || []
          };
        });
      }
    },
    // 修改订单状态
    async updateStatus(order_id, status) {
      try {
        const { user_id = "" } = this.userInfo;
        if (!user_id)
          return;
        await api_order.orderApi.updateOrderStatus({ order_id, status, user_id });
        common_vendor.index.showToast({ title: "操作成功" });
        this.getList();
      } catch (err) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    },
    // 退单
    async refundOrder(order_id) {
      common_vendor.index.showModal({
        title: "确认退单",
        content: "确定要取消该订单吗？",
        success: async (res) => {
          if (res.confirm) {
            this.updateStatus(order_id, 5);
          }
        }
      });
    },
    // 图片失败兜底
    handleImgErr(e) {
      e.target.src = "/static/default.png";
    },
    // 跳订单详情
    goDetail(order_id) {
      common_vendor.index.navigateTo({ url: `/pages/order/detail?order_id=${order_id}` });
    },
    // 跳聊天页（传对方ID、订单ID、对方昵称）
    goChat(oppositeUserId, orderId, oppositeNickname) {
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?to_user_id=${oppositeUserId}&order_id=${orderId}&nickname=${oppositeNickname}`
      });
    }
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo");
  },
  onLoad(options) {
    this.currentType = options.type || "";
    this.getList();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentType === "buy" ? 1 : "",
    b: common_vendor.o(($event) => $options.switchTab("buy")),
    c: $data.currentType === "sell" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchTab("sell")),
    e: $data.list.length === 0
  }, $data.list.length === 0 ? {
    f: common_assets._imports_0$1
  } : {}, {
    g: common_vendor.f($data.list, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.order_no),
        b: common_vendor.t($data.statusMap[item.status].text),
        c: common_vendor.n($data.statusMap[item.status].status),
        d: item.images[0],
        e: common_vendor.o((...args) => $options.handleImgErr && $options.handleImgErr(...args), item.order_id),
        f: common_vendor.t(item.goods_title),
        g: common_vendor.t(item.goods_price),
        h: item.status !== 4 && item.status !== 5
      }, item.status !== 4 && item.status !== 5 ? common_vendor.e({
        i: $data.currentType === "buy"
      }, $data.currentType === "buy" ? common_vendor.e({
        j: item.status === 1
      }, item.status === 1 ? {
        k: common_vendor.o(($event) => $options.updateStatus(item.order_id, 5), item.order_id)
      } : {}, {
        l: item.status === 2
      }, item.status === 2 ? {
        m: common_vendor.o(($event) => $options.updateStatus(item.order_id, 3), item.order_id)
      } : {}, {
        n: item.status === 2
      }, item.status === 2 ? {
        o: common_vendor.o(($event) => $options.refundOrder(item.order_id), item.order_id)
      } : {}) : {}, {
        p: $data.currentType === "sell"
      }, $data.currentType === "sell" ? common_vendor.e({
        q: item.status === 1
      }, item.status === 1 ? {
        r: common_vendor.o(($event) => $options.updateStatus(item.order_id, 2), item.order_id)
      } : {}, {
        s: item.status === 3 && item.seller_id === $data.userInfo.user_id
      }, item.status === 3 && item.seller_id === $data.userInfo.user_id ? {
        t: common_vendor.o(($event) => $options.updateStatus(item.order_id, 4), item.order_id)
      } : {}) : {}, {
        v: common_vendor.o(($event) => $options.goChat(item.seller_id, item.order_id, item.opposite_nickname), item.order_id)
      }) : {}, {
        w: item.order_id
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2863420b"]]);
wx.createPage(MiniProgramPage);
