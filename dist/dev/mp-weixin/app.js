"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/publish/index.js";
  "./pages/mine/index.js";
  "./pages/login/index.js";
  "./pages/mine/publish-list.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const UniIcons = () => "./node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("uni-icons", UniIcons);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
