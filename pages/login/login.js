// pages/login/login.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:"",
    verificationCode:"",
    seconds:0, //验证码秒数  
    origin:"1" //页面来源  1--个人中心  2--去投保
  },
  bindKeyInput(e){
    this.setData({
      phoneNumber:e.detail.value
    })
  },
  verificationCodeInput (e){
    this.setData({
      verificationCode: e.detail.value
    })
  },
  getVerificationCode () {
    if (!this.data.phoneNumber){//手机号为空
      wx.showModal({
        content: '手机号不能为空',
        showCancel: false
      });
    } else if (util.correctPhoneNumber(this.data.phoneNumber)){
      console.log('正确的手机号');
      this.sendVerificationCode(this.data.phoneNumber);
    }else{
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      });
    }
  },
  sendVerificationCode (phoneNumber) {
    let that = this;
    app.myReq({
      url: "sendVerificationCode.json",
      data: { phoneNumber: phoneNumber}
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.sendVerificationCode);
        } else if (res.data.retCode === "000") {//发送验证码成功
          that.setData({
            seconds:60
          }); 
          let timer = setInterval(function(){
            if (that.data.seconds<=1){
              clearInterval(timer);
              that.setData({
                seconds: 0
              });
            }else{
              console.log(that.data.seconds);
              that.setData({
                seconds: --that.data.seconds
              })
            }
          },1000);
        } else if (res.data.retCode === "222"){//手机号不再用户列表中
          wx.showModal({
            content: '无法登录',
            showCancel: false
          });
        } else if (res.data.retCode === "333") {//60s内多次请求
          wx.showModal({
            content: '请求过于频繁，请稍后再试',
            showCancel: false
          });
        } else {
          console.log('sendVerificationCode失败!');
        }

      } else {
        console.log('sendVerificationCode失败' + res.errMsg);
      }
    }).catch(err => {
      console.log(err);
    })
  },
  showTopTips (){
    if (!this.data.phoneNumber) {//手机号为空
      wx.showModal({
        content: '手机号不能为空',
        showCancel: false
      });
    } else if (!util.correctPhoneNumber(this.data.phoneNumber)) {
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      });
    } else if (!this.data.verificationCode){//验证码为空
      wx.showModal({
        content: '验证码不能为空',
        showCancel: false
      });
    }else{//请求登录接口
      this.requestLogin(this.data.phoneNumber,this.data.verificationCode);
    }
  },
  requestLogin(phoneNumber, verificationCode) {
    let that = this;
    app.myReq({
      url: "login.json",
      data: { phoneNumber: phoneNumber, verificationCode: verificationCode}
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestLogin);
        } else if (res.data.retCode === "000") {//登录成功
          if(that.data.origin === "1"){//个人中心
            wx.redirectTo({
              url: '../personalCenter/personalCenter'
            })
          } else if (that.data.origin === "2"){//去投保
            wx.redirectTo({
              url: '../basicVehicleInfo/basicVehicleInfo'
            })
          }
        } else if (res.data.retCode === "222") {//验证码错误
          wx.showModal({
            content: '验证码错误',
            showCancel: false
          });
        } else if (res.data.retCode === "333") {//验证码过期
          wx.showModal({
            content: '验证码已过期',
            showCancel: false
          });
        } else {
          console.log('login失败!');
          wx.showModal({
            content: '登录失败',
            showCancel: false
          });
        }

      } else {
        console.log('login失败' + res.errMsg);
      }
    }).catch(err => {
      console.log(err);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      origin:options.origin
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})