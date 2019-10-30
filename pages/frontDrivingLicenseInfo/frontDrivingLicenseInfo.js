// pages/frontDrivingLicenceInfo/frontDrivingLicenceInfo.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      licenseNumber:"",
      vehicleType:"",
      carOwner:"",
      brandModel:"",
      identificationCode:"",
      engineNumber:"",
      registerDate:""
  },
  engineNumberBlur(){
    if (this.data.engineNumber == "") {
      wx.showModal({
        content: '发动机号不能为空',
        showCancel: false
      });
      return;
    }
    if (!/^[0-9A-Za-z-]{3,16}$/.test(this.data.engineNumber)) {
      wx.showModal({
        content: '请输入正确的发动机号',
        showCancel: false
      });
    }
  },
  engineNumberChange(e){
    this.setData({
      engineNumber:e.detail.value
    })
  },
  identificationCodeBlur(){
    if (this.data.identificationCode == "") {
      wx.showModal({
        content: '识别代码不能为空',
        showCancel: false
      });
      return;
    }
    if (!/^[0-9A-Za-z]{11,20}$/.test(this.data.identificationCode)) {
      wx.showModal({
        content: '请输入正确的识别代码',
        showCancel: false
      });
    }
  },
  identificationCodeChange(e){
    this.setData({
      identificationCode:e.detail.value
    })
  },
  brandModelBlur(){
    if (this.data.brandModel == "") {
      wx.showModal({
        content: '品牌型号不能为空',
        showCancel: false
      });
    }
  },
  brandModelChange(e){
    this.setData({
      brandModel:e.detail.value
    })
  },
  carOwnerBlur() {
    if (this.data.carOwner == "") {
      wx.showModal({
        content: '所有人不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.carOwner, 2, 6)) {
      wx.showModal({
        content: '所有人为2~6个汉字',
        showCancel: false
      });
    }
  },
  carOwnerChange(e) {
    this.setData({
      carOwner: e.detail.value
    })
  },
  vehicleTypeBlur(){
    if (this.data.vehicleType == "") {
      wx.showModal({
        content: '车牌类型不能为空',
        showCancel: false
      });
    }
  },
  vehicleTypeChange(e){
    this.setData({
      vehicleType: e.detail.value
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
  licenseNumberChange(e){
    this.setData({
      licenseNumber: e.detail.value
    })
  },
  bindDateChange: function (e) {
      this.setData({
        registerDate: e.detail.value
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
    if (this.data.vehicleType == "") {
      wx.showModal({
        content: '车牌类型不能为空',
        showCancel: false
      });
      return;
    }
    if (this.data.carOwner == "") {
      wx.showModal({
        content: '所有人不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.carOwner, 2, 6)) {
      wx.showModal({
        content: '所有人为2~6个汉字',
        showCancel: false
      });
      return;
    }
    if (this.data.brandModel == "") {
      wx.showModal({
        content: '品牌型号不能为空',
        showCancel: false
      });
      return;
    }
    if (this.data.identificationCode == "") {
      wx.showModal({
        content: '识别代码不能为空',
        showCancel: false
      });
      return;
    }
    if (!/^[0-9A-Za-z]{11,20}$/.test(this.data.identificationCode)) {
      wx.showModal({
        content: '请输入正确的识别代码',
        showCancel: false
      });
      return;
    }
    if (this.data.engineNumber == "") {
      wx.showModal({
        content: '发动机号不能为空',
        showCancel: false
      });
      return;
    }
    if (!/^[0-9A-Za-z-]{3,16}$/.test(this.data.engineNumber)) {
      wx.showModal({
        content: '请输入正确的发动机号',
        showCancel: false
      });
      return;
    }
    if (this.data.registerDate == "") {
      wx.showModal({
        content: '注册日期不能为空',
        showCancel: false
      });
      return;
    }
    this.saveInfor();
  },
  saveInfor(){
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    });
    let that = this;
    app.myReq({
      url: "savePhotoInfor.json",
      data: {
        licenseNumber: that.data.licenseNumber,
        vehicleType: that.data.vehicleType,
        carOwner: that.data.carOwner,
        brandModel: that.data.brandModel,
        identificationCode: that.data.identificationCode,
        engineNumber: that.data.engineNumber,
        registerDate: that.data.registerDate
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveInfor);
        } else if (res.data.retCode === "000") {//信息保存成功
          wx.redirectTo({
            url: '../takePhoto/takePhoto?photoType=1'
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
      vehicleType: data.vehicleType,
      carOwner: data.carOwner,
      brandModel: data.brandModel,
      identificationCode: data.identificationCode,
      engineNumber: data.engineNumber,
      registerDate: data.registerDate
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