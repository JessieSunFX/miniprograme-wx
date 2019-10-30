// pages/backDrivingLicenseInfo/backDrivingLicenseInfo.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    licenseNumber: "",
    seatNumber:"",
    fileEncoding:""
  },
  fileEncodingBlur(){
    if (this.data.fileEncoding == "") {
      wx.showModal({
        content: '档案编号不能为空',
        showCancel: false
      });
      return;
    }
    if (!/^\d{12}$/.test(this.data.fileEncoding)) {
      wx.showModal({
        content: '请输入正确的档案编号',
        showCancel: false
      });
    }
  },
  fileEncodingChange(e){
    this.setData({
      fileEncoding:e.detail.value
    })
  },
  seatNumberBlur(){
    if (this.data.seatNumber == "") {
      wx.showModal({
        content: '座位数不能为空',
        showCancel: false
      });
      return;
    }
    if (parseFloat(this.data.seatNumber) > 99 || parseFloat(this.data.seatNumber) < 1 || !/^[0-9]{1,2}(\u5ea7)?$/.test(this.data.seatNumber)){
      wx.showModal({
        content: '请输入正确的座位数',
        showCancel: false
      });
    }
  },
  seatNumberChange(e){
    this.setData({
      seatNumber: e.detail.value
    })
  },
  licenseNumberBlur() {
    if (this.data.licenseNumber == "") {
      wx.showModal({
        content: '车牌号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctLicenseNumber(this.data.licenseNumber)) {
      wx.showModal({
        content: '请输入正确的车牌号',
        showCancel: false
      });
    }
  },
  licenseNumberChange(e) {
    this.setData({
      licenseNumber: e.detail.value
    })
  },
  showTopTips (){
    if (this.data.licenseNumber == "") {
      wx.showModal({
        content: '车牌号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctLicenseNumber(this.data.licenseNumber)) {
      wx.showModal({
        content: '请输入正确的车牌号',
        showCancel: false
      });
      return;
    }
    if (this.data.seatNumber == "") {
      wx.showModal({
        content: '座位数不能为空',
        showCancel: false
      });
      return;
    }
    if (parseFloat(this.data.seatNumber) > 99 || parseFloat(this.data.seatNumber) < 1 || !/^[0-9]{1,2}(\u5ea7)?$/.test(this.data.seatNumber)) {
      wx.showModal({
        content: '请输入正确的座位数',
        showCancel: false
      });
      return;
    }
    if (this.data.fileEncoding == "") {
      wx.showModal({
        content: '档案编号不能为空',
        showCancel: false
      });
      return;
    }
    if (!/^\d{12}$/.test(this.data.fileEncoding)) {
      wx.showModal({
        content: '请输入正确的档案编号',
        showCancel: false
      });
      return;
    }
    this.saveInfor();
  },
  saveInfor() {
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    });
    let that = this;
    app.myReq({
      url: "savePhotoInfor.json",
      data: {
        licenseNumber: that.data.licenseNumber,
        seatNumber: that.data.seatNumber,
        fileEncoding: that.data.fileEncoding
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveInfor);
        } else if (res.data.retCode === "000") {//信息保存成功
          wx.redirectTo({
            url: '../takePhoto/takePhoto?photoType=2'
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
    console.log(JSON.parse(wx.getStorageSync('identityInfor')));
    let data = JSON.parse(wx.getStorageSync('identityInfor'));
    this.setData({
      licenseNumber: data.licenseNumber,
      seatNumber: data.seatNumber,
      fileEncoding: data.fileEncoding
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