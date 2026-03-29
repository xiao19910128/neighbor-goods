"use strict";
const utils_https = require("../utils/https.js");
const messageApi = {
  sendMessage(data) {
    return utils_https.service({
      url: "/message/send",
      method: "post",
      data
    });
  },
  messageLists(data) {
    return utils_https.service({
      url: "/message/list",
      method: "post",
      data
    });
  },
  markRead(data) {
    return utils_https.service({
      url: "/message/markRead",
      method: "post",
      data
    });
  },
  sessionList(data) {
    return utils_https.service({
      url: "/message/sessionList",
      method: "post",
      data
    });
  }
};
exports.messageApi = messageApi;
