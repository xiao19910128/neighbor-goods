"use strict";
const common_vendor = require("../../common/vendor.js");
const api_message = require("../../api/message.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  name: "MessageListPage",
  components: { TabBar },
  data() {
    return {
      sessionList: [],
      userInfo: {},
      timer: null,
      // 清楚轮询的定时器
      isLogin: !!common_vendor.index.getStorageSync("token")
    };
  },
  onShow() {
    var _a;
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.isLogin = !!common_vendor.index.getStorageSync("token");
    if ((_a = this.userInfo) == null ? void 0 : _a.user_id) {
      this.getSessionList();
      this.startTimer();
    }
  },
  onLoad() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.isLogin = !!common_vendor.index.getStorageSync("token");
  },
  // 页面隐藏 → 清除定时器
  onHide() {
    this.clearTimer();
  },
  // 页面卸载 → 清除定时器
  onUnload() {
    this.clearTimer();
  },
  methods: {
    // 启动定时器
    startTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.getSessionList();
      }, 3e3);
    },
    // 安全清除定时器
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 获取会话列表
    async getSessionList() {
      var _a, _b;
      try {
        if (!((_a = this.userInfo) == null ? void 0 : _a.user_id))
          return;
        const res = await api_message.messageApi.messageLists({
          user_id: (_b = this.userInfo) == null ? void 0 : _b.user_id
        });
        if (res.code === 200) {
          this.sessionList = res.data;
        }
      } catch (err) {
      }
    },
    // 跳聊天页
    goChat({ other_user_id, order_id = "", username, session_id }) {
      try {
        let url = `/pages/chat/chat?to_user_id=${other_user_id}&order_id=${order_id}&nickname=${username}&session_id=${session_id}`;
        common_vendor.index.navigateTo({ url });
      } catch (e) {
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  (_easycom_uni_icons2 + _component_TabBar)();
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
        d: common_vendor.t((item == null ? void 0 : item.msg_type) === 1 ? "[图片]" : item.content),
        e: item.unread_count > 0
      }, item.unread_count > 0 ? {
        f: common_vendor.t(item.unread_count)
      } : {}, {
        g: item.to_user_id,
        h: common_vendor.o(($event) => $options.goChat(item), item.to_user_id)
      });
    })
  }), {
    f: common_vendor.p({
      defaultTab: "publish"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b77a8c2f"]]);
wx.createPage(MiniProgramPage);
