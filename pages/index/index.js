//index.js
//获取应用实例
const app = getApp()

var api = new Proxy(
  wx,
  {
    get(target, key){
      if (typeof target[key] === 'function') {
        return function (params, ...args) {
          return new Promise((resolve, reject) => {
            target[key]({
              ...params,
              success: function (data) {
                params.success && params.success(data);
              }
            }, ...args);
          });
        }
      }
    }
  }
);
// var prom = api.request();
// prom.then
// wx['request']()

Page({
  data: {
    isLoged:false,
    signage:"车险小助手",
    insuranceCompanyList:[
      {
        insuranceCompanyIcon:"../../img/yangguang.png",
        insuranceCompanyName:"阳光保险"
      },
      {
        insuranceCompanyIcon: "../../img/yongan.png",
        insuranceCompanyName: "永安保险"
      },
      {
        insuranceCompanyIcon: "../../img/taiping.png",
        insuranceCompanyName: "太平保险"
      },
      {
        insuranceCompanyIcon: "../../img/anhua.png",
        insuranceCompanyName: "安华保险"
      }
    ]
  },
  gotoInsure (){
    if (this.data.isLoged) {
      //已登录
      wx.navigateTo({
        url: '../basicVehicleInfo/basicVehicleInfo'
      })
    } else {
      //未登录，去登录页面
      wx.navigateTo({
        url: '../login/login?origin=2'
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    if (this.data.isLoged){
      //已登录，去个人中心页面
      wx.navigateTo({
        url: '../personalCenter/personalCenter'
      })
    }else{
      //未登录，去登录页面
      wx.navigateTo({
        url: '../login/login?origin=1'
      })
    }
  },
  getSignage (){
    let that=this;
    app.myReq({
      url: "carInsurance/getSignage"
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001"){//token过期
          app.getToken(that.getSignage);
        } else if (res.data.retCode === "002"){//未登录
          that.setData({
            signage: "车险小助手",
            isLoged: false
          });
        } else if (res.data.retCode === "000" && res.data.signage) {//正常返回所需信息
          that.setData({
            signage: res.data.signage,
            isLoged: true
          });
        }else{
          console.log('getSignage失败!');
        }
        
      } else {
        console.log('getSignage失败' + res.errMsg);
      }
    }).catch(err => {
      console.log(err);
    })
  },
  onLoad: function () {
    let value = wx.getStorageSync('token');
    if (!value) {
      app.getToken(this.getSignage);
    }else{
      this.getSignage();
    }
  }
})
