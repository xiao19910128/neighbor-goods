"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/https.js");
const _sfc_main = {
  data() {
    return {
      collectList: []
    };
  },
  onLoad() {
    this.getCollectList();
  },
  methods: {
    async getCollectList() {
      common_vendor.index.getStorageSync("userInfo");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.collectList, (item, k0, i0) => {
      return {
        a: JSON.parse(item.images)[0] || "/static/default.png",
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.price),
        d: item.goods_id
      };
    }),
    b: $data.collectList.length === 0
  }, $data.collectList.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
