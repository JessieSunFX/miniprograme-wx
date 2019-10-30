// pages/basicVehicleInfo/basicVehicleInfo.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    insuranceCity:"北京 北京市",
    licenseNumber:"",
    carOwnerName:"",
    phoneNumber:"",
    isTransferCar:false,
    transferDate:"",
    isOtherInsurance: false
  },
  bindDateChange (e){
    this.setData({
      transferDate:e.detail.value
    })
    console.log(this.data.transferDate);
  },
  switchChangedCar (e){
    this.setData({
      isTransferCar:e.detail.value
    })
  },
  phoneNumberBlur() {
    if (this.data.phoneNumber==""){
      wx.showModal({
        content: '手机号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctPhoneNumber(this.data.phoneNumber)) {
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      });
    }
  },
  phoneNumberChange (e){
    this.setData({
      phoneNumber:e.detail.value
    })
  },
  carOwnerNameBlur (){
    if(this.data.carOwnerName==""){
      wx.showModal({
        content: '车主姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.carOwnerName,2,6)){
      wx.showModal({
        content: '车主姓名为2~6个汉字',
        showCancel: false
      });
    }
  },
  carOwnerNameChange(e){
    this.setData({
      carOwnerName:e.detail.value
    })
  },
  licenseNumberBlur(){
    if(this.data.licenseNumber==""){
      wx.showModal({
        content: '车牌号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctLicenseNumber(this.data.licenseNumber)){
      wx.showModal({
        content: '请输入正确的车牌号',
        showCancel: false
      });
    }
  },
  licenseNumberChange (e){
    this.setData({
      licenseNumber: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      isOtherInsurance: !!e.detail.value.length
    });
    console.log(this.data.isOtherInsurance);
  },
  saveBasicInfo (){
    if (!this.data.isTransferCar && this.data.transferDate){
      this.setData({
        transferDate:""
      })
    }
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    });
    let that = this;
    app.myReq({
      url: "saveBasicInfo.json",
      data: { 
        insuranceCity: that.data.insuranceCity,
        licenseNumber: that.data.licenseNumber,
        carOwnerName: that.data.carOwnerName,
        phoneNumber: that.data.phoneNumber,
        isTransferCar: that.data.isTransferCar?"1":"2",
        transferDate: that.data.transferDate,
        isOtherInsurance: that.data.isOtherInsurance?"1":"2"
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveBasicInfo);
        } else if (res.data.retCode === "000") {//信息保存成功
          if (that.data.isOtherInsurance) {// 投保人非车主本人或公户车辆
            wx.redirectTo({
              url: '../policyholderInfo/policyholderInfo'
            })
          } else {
            wx.redirectTo({
              url: '../takePhoto/takePhoto?photoType=0'
            })
          }
        } else {//信息保存失败
          console.log('saveBasicInfo失败!');
          wx.showToast({
            title: '保存失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('saveBasicInfo失败' + res.errMsg);
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
  showTopTips(){
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
    if (this.data.carOwnerName == "") {
      wx.showModal({
        content: '车主姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.carOwnerName, 2, 6)) {
      wx.showModal({
        content: '车主姓名为2~6个汉字',
        showCancel: false
      });
      return;
    }
    if (this.data.phoneNumber == "") {
      wx.showModal({
        content: '手机号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctPhoneNumber(this.data.phoneNumber)) {
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      });
      return;
    }
    if (this.data.isTransferCar && !this.data.transferDate){
      wx.showModal({
        content: '请选择过户日期',
        showCancel: false
      });
      return;
    }
    this.saveBasicInfo();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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