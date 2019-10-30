// pages/policyholderInfo/policyholderInfo.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    policyHolderInfor:{
      name:"",
      identityCard:"",
      phoneNumber:""
    },
    insuredPersonInfor:{
      name: "",
      identityCard: "",
      phoneNumber: ""
    }
  },
  copyPolicyHolderInfor(){
    this.setData({
      insuredPersonInfor:{
        name: this.data.policyHolderInfor.name,
        identityCard: this.data.policyHolderInfor.identityCard,
        phoneNumber: this.data.policyHolderInfor.phoneNumber,
      }
    })
  },
  insuredPersonPhoneNumberBlur(){
    if (this.data.insuredPersonInfor.phoneNumber == "") {
      wx.showModal({
        content: '被保险人手机号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctPhoneNumber(this.data.insuredPersonInfor.phoneNumber)) {
      wx.showModal({
        content: '请输入正确的被保险人手机号',
        showCancel: false
      });
    }
  },
  insuredPersonPhoneNumberChange(e){
    let insuredPersonPhoneNumber = "insuredPersonInfor.phoneNumber";
    this.setData({
      [insuredPersonPhoneNumber]: e.detail.value
    })
  },
  policyHolderPhoneNumberBlur(){
    if (this.data.policyHolderInfor.phoneNumber == "") {
      wx.showModal({
        content: '投保人手机号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctPhoneNumber(this.data.policyHolderInfor.phoneNumber)) {
      wx.showModal({
        content: '请输入正确的投保人手机号',
        showCancel: false
      });
    }
  },
  policyHolderPhoneNumberChange(e){
    let policyHolderPhoneNumber = "policyHolderInfor.phoneNumber";
    this.setData({
      [policyHolderPhoneNumber]: e.detail.value
    })
  },
  insuredPersonIDCardBlur(){
    if (this.data.insuredPersonInfor.identityCard == "") {
      wx.showModal({
        content: '被保险人身份证不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctIDCard(this.data.insuredPersonInfor.identityCard)) {
      wx.showModal({
        content: '请输入正确的被保险人身份证',
        showCancel: false
      });
    }
  },
  insuredPersonIDCardChange(e){
    let insuredPersonIDCard = "insuredPersonInfor.identityCard";
    this.setData({
      [insuredPersonIDCard]: e.detail.value
    })
  },
  policyHolderIDCardBlur(){
    if (this.data.policyHolderInfor.identityCard == "") {
      wx.showModal({
        content: '投保人身份证不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctIDCard(this.data.policyHolderInfor.identityCard)) {
      wx.showModal({
        content: '请输入正确的投保人身份证',
        showCancel: false
      });
    }
  },
  policyHolderIDCardChange(e){
    let policyHolderIDCard = "policyHolderInfor.identityCard";
    this.setData({
      [policyHolderIDCard]: e.detail.value
    })
  },
  insuredPersonNameBlur() {
    if (this.data.insuredPersonInfor.name == "") {
      wx.showModal({
        content: '被保险人姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.insuredPersonInfor.name, 2, 6)) {
      wx.showModal({
        content: '被保险人姓名为2~6个汉字',
        showCancel: false
      });
    }
  },
  insuredPersonNameChange(e){
    let insuredPersonName = "insuredPersonInfor.name";
    this.setData({
      [insuredPersonName]: e.detail.value
    })
  },
  policyHolderNameBlur(){
    if (this.data.policyHolderInfor.name == "") {
      wx.showModal({
        content: '投保人姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.policyHolderInfor.name, 2, 6)) {
      wx.showModal({
        content: '投保人姓名为2~6个汉字',
        showCancel: false
      });
    }
  },
  policyHolderNameChange(e){
    let policyHolderName ="policyHolderInfor.name";
    this.setData({
      [policyHolderName]:e.detail.value
    })
  },
  
  showTopTips (){
    if (this.data.policyHolderInfor.name == "") {
      wx.showModal({
        content: '投保人姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.policyHolderInfor.name, 2, 6)) {
      wx.showModal({
        content: '投保人姓名为2~6个汉字',
        showCancel: false
      });
      return;
    }
    if (this.data.policyHolderInfor.identityCard == "") {
      wx.showModal({
        content: '投保人身份证不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctIDCard(this.data.policyHolderInfor.identityCard)) {
      wx.showModal({
        content: '请输入正确的投保人身份证',
        showCancel: false
      });
      return;
    }
    if (this.data.policyHolderInfor.phoneNumber == "") {
      wx.showModal({
        content: '投保人手机号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctPhoneNumber(this.data.policyHolderInfor.phoneNumber)) {
      wx.showModal({
        content: '请输入正确的投保人手机号',
        showCancel: false
      });
      return;
    }
    if (this.data.insuredPersonInfor.name == "") {
      wx.showModal({
        content: '被保险人姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.insuredPersonInfor.name, 2, 6)) {
      wx.showModal({
        content: '被保险人姓名为2~6个汉字',
        showCancel: false
      });
      return;
    }
    if (this.data.insuredPersonInfor.identityCard == "") {
      wx.showModal({
        content: '被保险人身份证不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctIDCard(this.data.insuredPersonInfor.identityCard)) {
      wx.showModal({
        content: '请输入正确的被保险人身份证',
        showCancel: false
      });
      return;
    }
    if (this.data.insuredPersonInfor.phoneNumber == "") {
      wx.showModal({
        content: '被保险人手机号不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctPhoneNumber(this.data.insuredPersonInfor.phoneNumber)) {
      wx.showModal({
        content: '请输入正确的被保险人手机号',
        showCancel: false
      });
      return;
    }
    this.savePolicyholderInfor();
  },
  savePolicyholderInfor() {
    console.log(this.data.policyHolderInfor);
    console.log(this.data.insuredPersonInfor);
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    });
    let that = this;
    app.myReq({
      url: "savePolicyholderInfor.json",
      data: {
        policyHolderInfor: that.data.policyHolderInfor,
        insuredPersonInfor: that.data.insuredPersonInfor
      }
    }).then(res => {
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.savePolicyholderInfor);
        } else if (res.data.retCode === "000") {//信息保存成功
          wx.redirectTo({
            url: '../takePhoto/takePhoto?photoType=0'
          })
        } else {//信息保存失败
          console.log('savePolicyholderInfor失败!');
          wx.showToast({
            title: '保存失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('savePolicyholderInfor失败' + res.errMsg);
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