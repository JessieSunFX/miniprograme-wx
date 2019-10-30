// pages/backIdentityCard/backIdentityCard.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authority:"",
    startDate:"",
    isLongTerm:false,
    terminationDate:""
  },
  authorityBlur(){
    if (this.data.authority == "") {
      wx.showModal({
        content: '签发机关不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.authority, 6, 20)) {
      wx.showModal({
        content: '签发机关为6~20个汉字',
        showCancel: false
      });
    }
  },
  authorityChange(e){
    this.setData({
      authority:e.detail.value
    })
  },
  startDateChange: function (e) {
    this.setData({
      startDate: e.detail.value,
      terminationDate: parseFloat(e.detail.value.substr(0, 4)) + 20 + '' + e.detail.value.substr(4)
    })
  },
  terminationDateChange: function (e) {
    this.setData({
      terminationDate: e.detail.value
    })
  },
  switchChange:function (e) { 
    this.setData({
      isLongTerm: e.detail.value
    });
  },
  showTopTips(){
    if (this.data.authority == "") {
      wx.showModal({
        content: '签发机关不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.authority, 6, 20)) {
      wx.showModal({
        content: '签发机关为6~20个汉字',
        showCancel: false
      });
      return;
    }
    if (this.data.startDate == "") {
      wx.showModal({
        content: '起始日期不能为空',
        showCancel: false
      });
      return;
    }
    if (!this.data.isLongTerm && this.data.terminationDate==""){
      wx.showModal({
        content: '终止日期不能为空',
        showCancel: false
      });
      return;
    }
    this.saveInfor();
  },
  saveInfor() {
    if (this.data.isLongTerm){
      this.setData({
        terminationDate:""
      })
    }
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    });
    let that = this;
    app.myReq({
      url: "savePhotoInfor.json",
      data: {
        authority: that.data.authority,
        startDate: that.data.startDate,
        isLongTerm: that.data.isLongTerm?"1":"2",
        terminationDate: that.data.terminationDate
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveInfor);
        } else if (res.data.retCode === "000") {//信息保存成功
          wx.redirectTo({
            url: '../vehicleInfoSupplement/vehicleInfoSupplement'
          })
        } else {//信息保存失败
          console.log('saveInfor失败!');
          wx.showToast({
            title: '保存失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('saveInfor失败' + res.errMsg);
        wx.showToast({
          title: '保存失败',
          image: '../../img/fail.png',
          duration: 3000
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '保存失败',
        image: '../../img/fail.png',
        duration: 3000
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(wx.getStorageSync('identityInfor'));
    this.setData({
      authority: data.authority,
      startDate: data.startDate,
      isLongTerm: data.isLongTerm=="1"?true:false,
      terminationDate: data.terminationDate
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