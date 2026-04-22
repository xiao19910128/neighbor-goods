"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const api_message = require("../../api/message.js");
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
          order_status: "primary"
        },
        2: {
          text: "待自提",
          order_status: "warning"
        },
        3: {
          text: "待收货",
          order_status: "primary"
        },
        4: {
          text: "已完成",
          order_status: "success"
        },
        5: {
          text: "已取消",
          order_status: "error"
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
    async updateStatus(order_id, order_status) {
      try {
        const { user_id = "" } = this.userInfo;
        if (!user_id)
          return;
        await api_order.orderApi.updateOrderStatus({ order_id, order_status, user_id });
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
    async goChat({ seller_id, order_id, opposite_nickname, user_id }) {
      const new_buy_id = this.currentType === "sell" ? seller_id : user_id;
      const new_seller_id = this.currentType === "buy" ? seller_id : user_id;
      const res = await api_message.messageApi.getSessionByUserPair({
        user1_id: new_buy_id,
        user2_id: new_seller_id
      });
      if (res.code === 200 && (res == null ? void 0 : res.session_id)) {
        common_vendor.index.navigateTo({
          url: `/pages/chat/chat?to_user_id=${new_seller_id}&order_id=${order_id}&nickname=${opposite_nickname}&session_id=${res.session_id}`
        });
      } else {
        common_vendor.index.showToast({ title: "获取会话失败", icon: "none" });
      }
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
      var _a;
      return common_vendor.e({
        a: common_vendor.t(item.order_no),
        b: common_vendor.t((_a = $data.statusMap[item.order_status]) == null ? void 0 : _a.text),
        c: common_vendor.n($data.statusMap[item.order_status].order_status),
        d: item.images[0],
        e: common_vendor.o((...args) => $options.handleImgErr && $options.handleImgErr(...args), item.order_id),
        f: common_vendor.t(item.goods_title),
        g: common_vendor.t(item.goods_price),
        h: item.order_status !== 4 && item.order_status !== 5
      }, item.order_status !== 4 && item.order_status !== 5 ? common_vendor.e({
        i: $data.currentType === "buy"
      }, $data.currentType === "buy" ? common_vendor.e({
        j: item.order_status === 1
      }, item.order_status === 1 ? {
        k: common_vendor.o(($event) => $options.updateStatus(item.order_id, 5), item.order_id)
      } : {}, {
        l: item.order_status === 2
      }, item.order_status === 2 ? {
        m: common_vendor.o(($event) => $options.updateStatus(item.order_id, 3), item.order_id)
      } : {}, {
        n: item.order_status === 2
      }, item.order_status === 2 ? {
        o: common_vendor.o(($event) => $options.refundOrder(item.order_id), item.order_id)
      } : {}) : {}, {
        p: $data.currentType === "sell"
      }, $data.currentType === "sell" ? common_vendor.e({
        q: item.order_status === 1
      }, item.order_status === 1 ? {
        r: common_vendor.o(($event) => $options.updateStatus(item.order_id, 2), item.order_id)
      } : {}, {
        s: item.order_status === 3 && item.seller_id === $data.userInfo.user_id
      }, item.order_status === 3 && item.seller_id === $data.userInfo.user_id ? {
        t: common_vendor.o(($event) => $options.updateStatus(item.order_id, 4), item.order_id)
      } : {}) : {}) : {}, {
        v: common_vendor.o(($event) => $options.goChat(item), item.order_id),
        w: item.order_id
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2863420b"]]);
wx.createPage(MiniProgramPage);
