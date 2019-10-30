//personalCenter.js
const app = getApp()
Page({
  data:{
    phoneNumber:"",
    orderQuantity:"",
    month:"",
    diamondNumber:""
  },
  logoutBtn(){
    this.requestLogout();
  },
  requestLogout(){
    wx.showToast({
      title: '退出登录中',
      icon: 'loading'
    });
    let that = this;
    app.myReq({
      url: "logout.json",
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestLogout);
        } else if (res.data.retCode === "000") {//请求成功
          wx.reLaunch({
            url: '../index/index'
          })
        } else {//请求失败
          console.log('requestLogout失败!');
          wx.showToast({
            title: '退出登录失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('requestLogout失败' + res.errMsg);
        wx.showToast({
          title: '退出登录失败',
          image: '../../img/fail.png',
          duration: 3000
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '退出登录失败',
        image: '../../img/fail.png',
        duration: 3000
      });
    })
  },
  performanceTapFun () {
    wx.navigateTo({
      url: '../myPerformance/myPerformance'
    })
  },
  diamondTapFun() {
    wx.navigateTo({
      url: '../myDiamond/myDiamond'
    })
  },
  requestInfor(){
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    let that = this;
    app.myReq({
      url: "personalInfor.json",
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestInfor);
        } else if (res.data.retCode === "000") {//请求成功
          that.setData({
            phoneNumber: res.data.phoneNumber,
            orderQuantity: res.data.orderQuantity,
            month: res.data.month,
            diamondNumber: res.data.diamondNumber
          })
        } else {//请求失败
          console.log('requestInfor失败!');
          wx.showToast({
            title: '加载失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('requestInfor失败' + res.errMsg);
        wx.showToast({
          title: '加载失败',
          image: '../../img/fail.png',
          duration: 3000
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '加载失败',
        image: '../../img/fail.png',
        duration: 3000
      });
    })
  },
  onLoad(){
    this.requestInfor();
  }
})