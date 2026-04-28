"use strict";
const common_vendor = require("../../common/vendor.js");
const api_goods = require("../../api/goods.js");
const TabBar = () => "../../components/TabBar.js";
const _sfc_main = {
  name: "IdleFishIndex",
  components: { TabBar },
  data() {
    return {
      products: [],
      searchValue: "",
      userInfo: {},
      viewMode: "double"
      // 初始为双排模式
    };
  },
  onShow() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      var _a, _b;
      this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
      const listRes = await api_goods.goodsApi.getGoodsList({ name: this.searchValue, user_id: (_a = this.userInfo) == null ? void 0 : _a.user_id });
      this.products = (_b = listRes.data) == null ? void 0 : _b.map((item) => {
        var _a2;
        return {
          ...item,
          image_url: (_a2 = item.image_url) == null ? void 0 : _a2.split(",")[0]
          // 首页只展示第一张图片
        };
      });
    },
    handleClear() {
      this.searchValue = "";
      this.getGoodsList();
    },
    handleSearch() {
      this.getGoodsList();
    },
    toDetail(product) {
      common_vendor.index.navigateTo({ url: `/pages/index/goods-detail?goods_id=${product.goods_id}` });
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_search_bar = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.handleSearch),
    b: common_vendor.o($options.handleClear),
    c: common_vendor.o(($event) => $data.searchValue = $event),
    d: common_vendor.p({
      cancelButton: "none",
      clearButton: "always",
      placeholder: "请输入名称筛选商品",
      modelValue: $data.searchValue
    }),
    e: $data.products.length
  }, $data.products.length ? {
    f: common_vendor.f($data.products, (product, index, i0) => {
      return {
        a: product.image_url,
        b: common_vendor.t(product.name),
        c: common_vendor.t(product.description),
        d: common_vendor.t(product.price),
        e: common_vendor.t(product.publisher_name || ""),
        f: index,
        g: common_vendor.o(($event) => $options.toDetail(product), index)
      };
    }),
    g: common_vendor.n($data.viewMode === "single" ? "single-column" : "double-column")
  } : {
    h: common_vendor.p({
      type: "info",
      size: "60",
      color: "#999"
    })
  }, {
    i: !$data.userInfo.user_id
  }, !$data.userInfo.user_id ? {
    j: common_vendor.o(($event) => common_vendor.index.navigateTo({
      url: "/pages/login/index"
    }))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
