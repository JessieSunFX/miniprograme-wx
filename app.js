//app.js
App({
  getToken(callback) {//获取token值   
    wx.login({
      success: res => {
        console.log(res);
        console.log(res.code);
        if (res.code) {
          // 发送 res.code 到后台换取 token
          wx.request({
            url: this.globalData.domainName + 'carInsurance/getToken', // 目标服务器 url
            method: "POST",
            data: { code: res.code },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            timeout: 10000,
            dataType: "json",
            success: (result) => {
              console.log(result);//打印返回数据
              if (result.statusCode === 200 && result.data.retCode === "000" && result.data.token) {
                console.log(result.data.token);
                wx.setStorageSync('token', result.data.token);
                if (callback) callback();
              } else {
                console.log('getToken失败！' + res.errMsg)
              }
            },
            fail: (error) => {
              console.log(error);//打印错误信息
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }

      },
      fail: (err) => {
        console.log(err);//打印错误信息
      }
    })
  },
  myReq(options) {//带header(token)
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.domainName + options.url, // 目标服务器 url
        header: options.header || { 'content-type': 'application/x-www-form-urlencoded', 'token': wx.getStorageSync('token') },
        method: options.method || "POST",
        data: options.data || "",
        timeout: options.timeout || 10000,
        dataType: options.dataType || "json",
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      });
    })
  },
  onLaunch: function () {

  },
  globalData: {
    domainName: "http://47.95.113.208:8181/" //全局配置域名(测试)
  }
})
