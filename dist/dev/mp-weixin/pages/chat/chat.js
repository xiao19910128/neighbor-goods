"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const api_message = require("../../api/message.js");
const _sfc_main = {
  data() {
    return {
      to_user_id: "",
      order_id: "",
      nickname: "",
      msgContent: "",
      msgList: [],
      userInfo: {},
      oppositeAvatar: ""
    };
  },
  onLoad(options) {
    this.to_user_id = options.to_user_id;
    this.order_id = options.order_id;
    this.nickname = options.nickname;
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    common_vendor.index.setNavigationBarTitle({ title: this.nickname || "聊天" });
    this.getOppositeInfo();
    this.getMsgList();
    this.timer = setInterval(() => this.getMsgList(), 3e3);
  },
  onUnload() {
    clearInterval(this.timer);
    this.markRead();
  },
  methods: {
    // 获取对方信息
    async getOppositeInfo() {
      try {
        const res = await api_user.userApi.getUserInfo({ user_id: this.to_user_id });
        if (res.code === 200) {
          this.oppositeAvatar = res.data.avatar_url || "https://picsum.photos/id/1005/100/100";
        }
      } catch (err) {
      }
    },
    // 获取消息列表
    async getMsgList() {
      try {
        const res = await api_message.messageApi.messageLists({
          user_id: this.userInfo.user_id,
          to_user_id: this.to_user_id,
          order_id: this.order_id
        });
        if (res.code === 200) {
          this.msgList = res.data;
          this.$nextTick(() => {
            const query = common_vendor.index.createSelectorQuery().in(this);
            query.select("#msg-list").boundingClientRect();
            query.exec((res2) => {
              var _a;
              if ((_a = res2[0]) == null ? void 0 : _a.height) {
                common_vendor.index.pageScrollTo({ scrollTop: res2[0].height, duration: 0 });
              }
            });
          });
        }
      } catch (err) {
        console.error("获取消息失败", err);
      }
    },
    // 发送消息
    async sendMsg() {
      if (!this.msgContent.trim())
        return;
      try {
        await api_message.messageApi.sendMessage({
          sender_id: this.userInfo.user_id,
          receiver_id: this.to_user_id,
          order_id: this.order_id,
          content: this.msgContent.trim()
        });
        this.msgContent = "";
        this.getMsgList();
      } catch (err) {
        common_vendor.index.showToast({ title: "发送失败", icon: "none" });
      }
    },
    // 标记已读
    async markRead() {
      try {
        await api_message.messageApi.markRead({
          user_id: this.userInfo.user_id,
          to_user_id: this.to_user_id,
          order_id: this.order_id
        });
      } catch (err) {
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.msgList, (item, k0, i0) => {
      return {
        a: item.sender_id === $data.userInfo.user_id ? $data.userInfo.avatar_url : $data.oppositeAvatar,
        b: common_vendor.t(item.content),
        c: item.sender_id === $data.userInfo.user_id ? 1 : "",
        d: item.id
      };
    }),
    b: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args)),
    c: $data.msgContent,
    d: common_vendor.o(($event) => $data.msgContent = $event.detail.value),
    e: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a041b13f"]]);
wx.createPage(MiniProgramPage);
