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
      method: "get",
      params: data
    });
  },
  markRead(data) {
    return utils_https.service({
      url: "/message/markRead",
      method: "post",
      data
    });
  },
  // sessionList(data) {
  //   return request({
  //     url: '/message/sessionList',
  //     method: 'post',
  //     data
  //   });
  // },
  getSessionByUserPair(data) {
    return utils_https.service({
      url: "/message/getSessionByUserPair",
      method: "get",
      params: data
    });
  },
  getHistoryMsg(data) {
    return utils_https.service({
      url: "/message/history",
      method: "get",
      params: data
    });
  }
};
exports.messageApi = messageApi;
