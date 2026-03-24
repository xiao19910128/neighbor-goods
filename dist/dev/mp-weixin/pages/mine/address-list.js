"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const _sfc_main = {
  data() {
    return {
      addressLists: []
    };
  },
  onShow() {
    this.getList();
  },
  methods: {
    // 获取地址列表
    async getList() {
      try {
        const user = common_vendor.index.getStorageSync("userInfo");
        if (!user || !user.user_id) {
          return;
        }
        const res = await api_address.addressApi.getAddressList({ user_id: user.user_id });
        if ((res == null ? void 0 : res.code) === 200) {
          this.addressLists = res == null ? void 0 : res.data;
        }
      } catch (err) {
      }
    },
    // 新增地址
    add() {
      common_vendor.index.navigateTo({ url: "/pages/mine/address-edit" });
    },
    // 编辑地址
    edit(item) {
      common_vendor.index.navigateTo({
        url: `/pages/mine/address-edit?address=${encodeURIComponent(JSON.stringify(item))}`
      });
    },
    // 删除地址
    async del(address_id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除该地址吗？",
        success: async () => {
          const user = common_vendor.index.getStorageSync("userInfo");
          await api_address.addressApi.deleteAddress({ address_id, user_id: user.user_id });
          common_vendor.index.showToast({ title: "删除成功", icon: "none" });
          this.getList();
        }
      });
    },
    // 微信获取地址
    async getWechatAddress() {
      try {
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.chooseAddress({
            success: resolve,
            fail: reject
          });
        });
        const user = common_vendor.index.getStorageSync("userInfo");
        await api_address.addressApi.addAddress({
          user_id: user.user_id,
          name: res.userName,
          phone: res.telNumber,
          province: res.provinceName,
          city: res.cityName,
          county: res.districtName,
          detail: res.detailInfo,
          is_default: 0
        });
        common_vendor.index.showToast({ title: "添加成功", icon: "none" });
        this.getList();
      } catch (err) {
        common_vendor.index.showToast({ title: "获取失败", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.addressLists.length > 0
  }, $data.addressLists.length > 0 ? {
    b: common_vendor.f($data.addressLists, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.phone),
        c: item.is_default === 1
      }, item.is_default === 1 ? {} : {}, {
        d: common_vendor.t(item.province),
        e: common_vendor.t(item.city),
        f: common_vendor.t(item.county),
        g: common_vendor.t(item.detail),
        h: common_vendor.o(($event) => $options.edit(item), item.address_id),
        i: common_vendor.o(($event) => $options.del(item.address_id), item.address_id),
        j: item.address_id
      });
    })
  } : {}, {
    c: common_vendor.o((...args) => $options.getWechatAddress && $options.getWechatAddress(...args)),
    d: common_vendor.o((...args) => $options.add && $options.add(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ce825346"]]);
wx.createPage(MiniProgramPage);
