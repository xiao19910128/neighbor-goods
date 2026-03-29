"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_https = require("../../utils/https.js");
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
    common_vendor.index.setNavigationBarTitle({ title: this.nickname });
    this.getOppositeInfo();
    this.getMsgList();
    this.timer = setInterval(() => this.getMsgList(), 3e3);
  },
  onUnload() {
    clearInterval(this.timer);
    this.markRead();
  },
  methods: {
    // 获取对方信息（头像）
    async getOppositeInfo() {
      try {
        const res = await utils_https.service({
          url: "/api/user/info",
          method: "POST",
          data: { user_id: this.to_user_id }
        });
        if (res.code === 200) {
          this.oppositeAvatar = res.data.avatar_url || "/static/default-avatar.png";
        }
      } catch (err) {
      }
    },
    // 获取消息列表
    async getMsgList() {
      try {
        const res = await utils_https.service({
          url: "/api/message/list",
          method: "POST",
          data: {
            user_id: this.userInfo.user_id,
            to_user_id: this.to_user_id,
            order_id: this.order_id
          }
        });
        if (res.code === 200) {
          this.msgList = res.data;
          this.$nextTick(() => {
            const query = common_vendor.index.createSelectorQuery().in(this);
            query.select("#msg-list").boundingClientRect();
            query.exec((res2) => {
              common_vendor.index.pageScrollTo({ scrollTop: res2[0].height, duration: 0 });
            });
          });
        }
      } catch (err) {
      }
    },
    // 发送消息
    async sendMsg() {
      if (!this.msgContent.trim())
        return;
      try {
        await utils_https.service({
          url: "/api/message/send",
          method: "POST",
          data: {
            sender_id: this.userInfo.user_id,
            receiver_id: this.to_user_id,
            order_id: this.order_id,
            content: this.msgContent.trim()
          }
        });
        this.msgContent = "";
        this.getMsgList();
      } catch (err) {
        common_vendor.index.showToast({ title: "发送失败", icon: "none" });
      }
    },
    // 标记消息已读
    async markRead() {
      try {
        await utils_https.service({
          url: "/api/message/markRead",
          method: "POST",
          data: {
            user_id: this.userInfo.user_id,
            to_user_id: this.to_user_id,
            order_id: this.order_id
          }
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
