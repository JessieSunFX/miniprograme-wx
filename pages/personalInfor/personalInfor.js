// pages/personalInfor/personalInfor.js
const app=getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'15611006491', //用户名，不可编辑
    emailAddress:'',//电子邮箱，最大长度30个字符，可为空
    region: [],//region[0]--省份  region[1]--市 region[2]--区
    streetName:'',//街道名称  最大30个字符，可为空
    identityCard:'',//身份证，可为空
    signage:'' //店招， 4-16个字符，可为空

  },

  bindRegionChange(e) {//省份 城市改变事件
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value.length === this.data.region.length && e.detail.value[0] === this.data.region[0] && e.detail.value[1] === this.data.region[1] && e.detail.value[2] === this.data.region[2]){
        console.log('未改动');
        return;
    }
    this.setData({
      region: e.detail.value
    })
    //请求保存省份城市接口
    this.saveRegion();
  },
  saveRegion() {
    let that = this;
    app.myReq({
      url: "saveEmailAddr.json",
      data: {
        region: that.data.region
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveRegion);
        } else if (res.data.retCode === "000") {//请求成功

        } else {//请求失败
          console.log('saveRegion失败!');
          wx.showToast({
            title: '更新失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('saveRegion失败' + res.errMsg);
        wx.showToast({
          title: '更新失败',
          image: '../../img/fail.png',
          duration: 3000
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '更新失败',
        image: '../../img/fail.png',
        duration: 3000
      });
    })
  },
  bindEmailAddrBlur(e) {//电子邮箱失焦事件
    console.log(e.detail.value);
    if(e.detail.value === this.data.emailAddress){//未进行任何修改编辑
      return;
    }
    this.setData({
      emailAddress: e.detail.value
    })
    if (this.data.emailAddress === '' || util.correctEmailAddr(this.data.emailAddress)){//电子邮箱验证成功  || 电子邮箱为空，请求保存电子邮箱接口
      this.saveEmailAddr();
    }else{//电子邮箱验证不成功，进行相应的提示
      wx.showModal({
        content: '电子邮箱格式不正确',
        showCancel: false
      });
    }
  },
  saveEmailAddr(){
    let that = this;
    app.myReq({
      url: "saveEmailAddr.json",
      data:{
        emailAddress: that.data.emailAddress
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveEmailAddr);
        } else if (res.data.retCode === "000") {//请求成功
          
        } else {//请求失败
          console.log('saveEmailAddr失败!');
          wx.showToast({
            title: '更新失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('saveEmailAddr失败' + res.errMsg);
        wx.showToast({
          title: '更新失败',
          image: '../../img/fail.png',
          duration: 3000
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '更新失败',
        image: '../../img/fail.png',
        duration: 3000
      });
    })
  },
  bindStreetNameBlur(e) {//街道item失焦事件
    console.log(e.detail.value);
    if(e.detail.value === this.data.streetName){
        return;
    }
    this.setData({
      streetName:e.detail.value
    })
    //验证街道信息是否小于等于30个字符 || 为空
    if (this.data.streetName === '' || util.stringLengthJudge(this.data.streetName,0,30)) {//验证通过，请求保存街道信息接口
      this.saveStreetName();
    }else{
      wx.showModal({
        content: '街道信息最大为30个字符',
        showCancel: false
      });
    }
  },
  saveStreetName() {
    let that = this;
    app.myReq({
      url: "saveEmailAddr.json",
      data: {
        streetName: that.data.streetName
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveStreetName);
        } else if (res.data.retCode === "000") {//请求成功

        } else {//请求失败
          console.log('saveStreetName失败!');
          wx.showToast({
            title: '更新失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('saveStreetName失败' + res.errMsg);
        wx.showToast({
          title: '更新失败',
          image: '../../img/fail.png',
          duration: 3000
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '更新失败',
        image: '../../img/fail.png',
        duration: 3000
      });
    })
  },
  bindIdentityCardBlur(e) {//身份证item失焦事件
    console.log(e.detail.value);
    if (e.detail.value === this.data.identityCard){
      return;
    }
    this.setData({
      identityCard:e.detail.value
    })
    
    if (this.data.identityCard === '' || util.correctIDCard(this.data.identityCard)) {//验证通过，请求保存身份证号接口
      this.saveIdentityCard();
    } else {
      wx.showModal({
        content: '身份证号格式不正确',
        showCancel: false
      });
    }
  },
  saveIdentityCard() {
    let that = this;
    app.myReq({
      url: "saveEmailAddr.json",
      data: {
        identityCard: that.data.identityCard
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveIdentityCard);
        } else if (res.data.retCode === "000") {//请求成功

        } else {//请求失败
          console.log('saveIdentityCard失败!');
          wx.showToast({
            title: '更新失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('saveIdentityCard失败' + res.errMsg);
        wx.showToast({
          title: '更新失败',
          image: '../../img/fail.png',
          duration: 3000
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '更新失败',
        image: '../../img/fail.png',
        duration: 3000
      });
    })
  },
  bindSignageBlur(e) {
    console.log(e.detail.value);
    if (e.detail.value === this.data.signage) {
      return;
    }
    this.setData({
      signage: e.detail.value
    })
    //店招为4-16个字符 || 为空
    if (this.data.signage === '' || util.stringLengthJudge(this.data.signage,4,16)) {//验证通过，请求保存店招接口
      this.saveSignage();
    } else {
      wx.showModal({
        content: '店招为4~16个字符',
        showCancel: false
      });
    }
  },
  saveSignage() {
    let that = this;
    app.myReq({
      url: "saveEmailAddr.json",
      data: {
        signage: that.data.signage
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveSignage);
        } else if (res.data.retCode === "000") {//请求成功

        } else {//请求失败
          console.log('saveSignage失败!');
          wx.showToast({
            title: '更新失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('saveSignage失败' + res.errMsg);
        wx.showToast({
          title: '更新失败',
          image: '../../img/fail.png',
          duration: 3000
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '更新失败',
        image: '../../img/fail.png',
        duration: 3000
      });
    })
  },
  requestUsername(){
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    app.myReq({
      url: "getUsername.json",
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestUsername);
        } else if (res.data.retCode === "000") {//请求成功
          that.setData({
            username: res.data.username,
            emailAddress: res.data.emailAddress,
            region: res.data.region,
            streetName: res.data.streetName,
            identityCard: res.data.identityCard,
            signage: res.data.signage
          })
        } else {//请求失败
          console.log('requestUsername失败!');
          wx.showToast({
            title: '加载失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('requestUsername失败' + res.errMsg);
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestUsername();
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