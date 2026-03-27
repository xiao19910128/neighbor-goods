"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const api_order = require("../../api/order.js");
const _sfc_main = {
  data() {
    return {
      addressLists: [],
      isSelectMode: false,
      // 是否为选择模式（从商品详情跳转）
      selectedId: 0,
      // 选中的地址ID
      goods_id: 0,
      // 下单的商品ID
      userInfo: {}
    };
  },
  onLoad(options) {
    if (options.from === "buy") {
      this.isSelectMode = true;
      this.goods_id = options.goods_id;
      common_vendor.index.setNavigationBarTitle({ title: "选择收货地址" });
    }
    this.getList();
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.getList();
  },
  methods: {
    // 获取地址列表
    async getList() {
      const { user_id = "" } = this.userInfo;
      if (!user_id)
        return;
      const res = await api_address.addressApi.getAddressList({ user_id });
      if ((res == null ? void 0 : res.code) === 200) {
        this.addressLists = res.data;
        const defaultAddr = res.data.find((item) => item.is_default === 1);
        if (defaultAddr) {
          this.selectedId = defaultAddr.address_id;
        }
      }
    },
    // 点击地址项选择
    handleSelect(item) {
      if (!this.isSelectMode)
        return;
      this.selectedId = item.address_id;
    },
    // 确认选择（创建订单）
    async confirmSelect() {
      if (!this.selectedId) {
        common_vendor.index.showToast({ title: "请选择地址", icon: "none" });
        return;
      }
      const { user_id = "" } = this.userInfo;
      if (!user_id) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/login/index" });
        }, 300);
        return;
      }
      try {
        const res = await api_order.orderApi.createOrder({
          user_id,
          goods_id: this.goods_id,
          address_id: this.selectedId
        });
        if (res.code === 200) {
          common_vendor.index.showToast({ title: "下单成功" });
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/orders/order-list?type=buy" });
          }, 1e3);
        } else {
          common_vendor.index.showToast({ title: res.msg || "下单失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.showToast({ title: (err == null ? void 0 : err.message) || (err == null ? void 0 : err.msg), icon: "none" });
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
          const { user_id = "" } = this.userInfo;
          if (!user_id) {
            common_vendor.index.showToast({ title: "请先登录", icon: "none" });
            setTimeout(() => {
              common_vendor.index.navigateTo({ url: "/pages/login/index" });
            }, 300);
            return;
          }
          await api_address.addressApi.deleteAddress({ address_id, user_id });
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
        const { user_id = "" } = this.userInfo;
        if (!user_id) {
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/login/index" });
          }, 300);
          return;
        }
        await api_address.addressApi.addAddress({
          user_id,
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
    a: $data.addressLists.length === 0
  }, $data.addressLists.length === 0 ? {} : {}, {
    b: common_vendor.f($data.addressLists, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.phone),
        c: item.is_default === 1
      }, item.is_default === 1 ? {} : {}, {
        d: common_vendor.t(item.province),
        e: common_vendor.t(item.city),
        f: common_vendor.t(item.county),
        g: common_vendor.t(item.detail)
      }, !$data.isSelectMode ? {
        h: common_vendor.o(($event) => $options.edit(item), item.address_id),
        i: common_vendor.o(($event) => $options.del(item.address_id), item.address_id)
      } : {}, {
        j: $data.isSelectMode && $data.selectedId === item.address_id
      }, $data.isSelectMode && $data.selectedId === item.address_id ? {} : {}, {
        k: item.address_id,
        l: $data.isSelectMode && $data.selectedId === item.address_id ? 1 : "",
        m: common_vendor.o(($event) => $options.handleSelect(item), item.address_id)
      });
    }),
    c: !$data.isSelectMode,
    d: common_vendor.o((...args) => $options.getWechatAddress && $options.getWechatAddress(...args)),
    e: common_vendor.o((...args) => $options.add && $options.add(...args)),
    f: $data.isSelectMode
  }, $data.isSelectMode ? {
    g: common_vendor.o((...args) => $options.confirmSelect && $options.confirmSelect(...args)),
    h: !$data.selectedId
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ce825346"]]);
wx.createPage(MiniProgramPage);
