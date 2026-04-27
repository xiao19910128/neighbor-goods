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
      messageList: [],
      userInfo: {},
      oppositeAvatar: "",
      session_id: "",
      timer: null
    };
  },
  onLoad(options) {
    var _a;
    this.session_id = options.session_id;
    this.to_user_id = options.to_user_id;
    this.order_id = options.order_id;
    this.nickname = options.nickname;
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    common_vendor.index.setNavigationBarTitle({ title: ((_a = this.userInfo) == null ? void 0 : _a.nickname) || "聊天" });
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
          this.oppositeAvatar = res.data.avatarUrl || "https://picsum.photos/id/1005/100/100";
        }
      } catch (err) {
      }
    },
    // 获取消息列表
    async getMsgList() {
      try {
        const res = await api_message.messageApi.getHistoryMsg({
          user_id: this.userInfo.user_id,
          session_id: this.session_id
        });
        if (res.code === 200) {
          this.messageList = res.data;
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
    async sendMsg(msg_type = "text", imageUrl = "") {
      const msgContent = this.msgContent.trim();
      if (!msgContent && msg_type === "text")
        return;
      try {
        await api_message.messageApi.sendMessage({
          session_id: this.session_id,
          sender_id: this.userInfo.user_id,
          receiver_id: this.to_user_id,
          order_id: this.order_id,
          content: msg_type === "image" ? imageUrl : this.msgContent.trim(),
          msg_type: msg_type === "image" ? 1 : 0
          // 新增一个字段：1=图片，0=文本
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
          order_id: this.order_id || null
        });
      } catch (err) {
      }
    },
    // 选择图片（拍照/相册）
    chooseImage() {
      common_vendor.index.chooseImage({
        sizeType: ["compressed"],
        // 压缩图片
        sourceType: ["album", "camera"],
        // 支持相册和拍照
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.uploadImage(tempFilePath);
        }
      });
    },
    // 上传图片到后端
    async uploadImage(filePath) {
      common_vendor.index.showLoading({ title: "发送中..." });
      return new Promise((resolve) => {
        common_vendor.index.uploadFile({
          url: "http://192.168.3.116:3000/api/upload/chatImage",
          filePath,
          name: "file",
          success: (uploadRes) => {
            var _a;
            try {
              const data = JSON.parse(uploadRes.data);
              if ((data == null ? void 0 : data.code) === 200) {
                const url = typeof data.data === "string" ? data.data : (_a = data.data) == null ? void 0 : _a.url;
                this.sendMsg("image", url);
                resolve(url || null);
              } else {
                resolve(null);
              }
            } catch (e) {
              resolve(null);
            }
          },
          fail: () => {
            common_vendor.index.showToast({ title: "上传失败", icon: "none" });
          },
          complete: () => {
            common_vendor.index.hideLoading();
          }
        });
      });
    },
    previewImage(url) {
      common_vendor.index.previewImage({
        urls: [url],
        current: url
      });
    },
    // 批量预览--有点bug，暂时不用了
    previewImage1(url) {
      var _a, _b;
      const allImages = ((_b = (_a = this.messageList) == null ? void 0 : _a.filter((item) => item.msg_type === 1 && item.content)) == null ? void 0 : _b.map((item) => item.content)) || [];
      if (allImages.length === 0)
        return;
      common_vendor.index.previewImage({
        urls: allImages,
        current: url,
        loop: true
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.messageList, (item, k0, i0) => {
      return common_vendor.e({
        a: item.sender_id === $data.userInfo.user_id ? $data.userInfo.avatarUrl || "/static/default-avatar.png" : $data.oppositeAvatar,
        b: item.msg_type === 0
      }, item.msg_type === 0 ? {
        c: common_vendor.t(item.content)
      } : item.msg_type === 1 ? {
        e: item.content,
        f: common_vendor.o(($event) => $options.previewImage(item.content), item.id)
      } : {}, {
        d: item.msg_type === 1,
        g: item.sender_id === $data.userInfo.user_id ? 1 : "",
        h: item.id
      });
    }),
    b: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args)),
    c: $data.msgContent,
    d: common_vendor.o(($event) => $data.msgContent = $event.detail.value),
    e: !$data.msgContent
  }, !$data.msgContent ? {
    f: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {
    g: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a041b13f"]]);
wx.createPage(MiniProgramPage);
