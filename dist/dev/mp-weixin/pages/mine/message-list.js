"use strict";
const common_vendor = require("../../common/vendor.js");
const api_message = require("../../api/message.js");
const _sfc_main = {
  data() {
    return {
      sessionList: [],
      userInfo: {},
      isLogin: !!common_vendor.index.getStorageSync("token")
    };
  },
  onShow() {
    var _a;
    if ((_a = this.userInfo) == null ? void 0 : _a.user_id)
      return;
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.isLogin = !!common_vendor.index.getStorageSync("token");
  },
  onLoad() {
    var _a;
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.isLogin = !!common_vendor.index.getStorageSync("token");
    if (!((_a = this.userInfo) == null ? void 0 : _a.user_id))
      return;
    this.getSessionList();
    this.timer = setInterval(() => this.getSessionList(), 3e3);
  },
  onUnload() {
    clearInterval(this.timer);
  },
  methods: {
    // 获取会话列表
    async getSessionList() {
      var _a;
      try {
        const res = await api_message.messageApi.messageLists({ user_id: (_a = this.userInfo) == null ? void 0 : _a.user_id });
        if (res.code === 200) {
          this.sessionList = res.data;
        }
      } catch (err) {
      }
    },
    // 跳聊天页
    goChat({ other_user_id, order_id = "", username, session_id }) {
      if (!order_id && !["null", "undefined"].includes(order_id))
        common_vendor.index.navigateTo({
          url: `/pages/chat/chat?to_user_id=${other_user_id}&order_id=${order_id}&nickname=${username}&session_id=${session_id}`
        });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b;
  return common_vendor.e({
    a: !$data.isLogin
  }, !$data.isLogin ? {
    b: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: "/pages/login/index"
    }))
  } : common_vendor.e({
    c: !((_a = $data.sessionList) == null ? void 0 : _a.length)
  }, !((_b = $data.sessionList) == null ? void 0 : _b.length) ? {
    d: common_vendor.p({
      type: "chatboxes-filled",
      size: "60",
      color: "#999"
    })
  } : {}, {
    e: common_vendor.f($data.sessionList, (item, k0, i0) => {
      return common_vendor.e({
        a: item.avatar_url,
        b: common_vendor.t(item.username),
        c: common_vendor.t(item.last_time),
        d: common_vendor.t(item.content),
        e: item.unread_count > 0
      }, item.unread_count > 0 ? {
        f: common_vendor.t(item.unread_count)
      } : {}, {
        g: item.to_user_id,
        h: common_vendor.o(($event) => $options.goChat(item), item.to_user_id)
      });
    })
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b77a8c2f"]]);
wx.createPage(MiniProgramPage);
