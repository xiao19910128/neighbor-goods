"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_https = require("../../utils/https.js");
const _sfc_main = {
  data() {
    return {
      sessionList: [],
      userInfo: {}
    };
  },
  onLoad() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.getSessionList();
    this.timer = setInterval(() => this.getSessionList(), 3e3);
  },
  onUnload() {
    clearInterval(this.timer);
  },
  methods: {
    // 获取会话列表
    async getSessionList() {
      try {
        const res = await utils_https.service({
          url: "/api/message/sessionList",
          method: "POST",
          data: { user_id: this.userInfo.user_id }
        });
        if (res.code === 200) {
          this.sessionList = res.data;
        }
      } catch (err) {
      }
    },
    // 跳聊天页
    goChat(toUserId, orderId, nickname) {
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?to_user_id=${toUserId}&order_id=${orderId}&nickname=${nickname}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.sessionList, (item, k0, i0) => {
      return common_vendor.e({
        a: item.avatar_url,
        b: common_vendor.t(item.nickname),
        c: common_vendor.t(item.last_time),
        d: common_vendor.t(item.last_msg),
        e: item.unread_count > 0
      }, item.unread_count > 0 ? {
        f: common_vendor.t(item.unread_count)
      } : {}, {
        g: item.to_user_id,
        h: common_vendor.o(($event) => $options.goChat(item.to_user_id, item.order_id, item.nickname), item.to_user_id)
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b77a8c2f"]]);
wx.createPage(MiniProgramPage);
