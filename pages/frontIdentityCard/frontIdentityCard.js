// pages/frontIdentityCard/frontIdentityCard.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    nation:"",
    birthDate:"",
    address:"",
    identityCard:"",
    genderList:["男","女"],
    gender:0
  },
  identityCardBlur(){
    if (this.data.identityCard == "") {
      wx.showModal({
        content: '身份证不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctIDCard(this.data.identityCard)) {
      wx.showModal({
        content: '请输入正确的身份证',
        showCancel: false
      });
    }
  },
  identityCardChange(e){
    this.setData({
      identityCard:e.detail.value
    })
  },
  addressBlur(){
    if (this.data.address == "") {
      wx.showModal({
        content: '地址不能为空',
        showCancel: false
      });
      return;
    }
    if(this.data.address.length>20 || this.data.address.length<6){
      wx.showModal({
        content: '地址长度为6~20',
        showCancel: false
      });
    }
  },
  addressChange(e){
    this.setData({
      address:e.detail.value
    })
  },
  nationBlur(){
    if (this.data.nation == "") {
      wx.showModal({
        content: '民族不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.nation, 1, 5)) {
      wx.showModal({
        content: '民族为1~5个汉字',
        showCancel: false
      });
    }
  },
  nationChange(e){
    this.setData({
      nation:e.detail.value
    })
  },
  nameBlur(){
    if (this.data.name == "") {
      wx.showModal({
        content: '姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.name, 2, 6)) {
      wx.showModal({
        content: '姓名为2~6个汉字',
        showCancel: false
      });
    }
  },
  nameChange(e){
    this.setData({
      name:e.detail.value
    })
  },

  bindGenderChange: function (e) {
    console.log('picker gender 发生选择改变，携带值为', e.detail.value);
    this.setData({
      gender: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      birthDate: e.detail.value
    })
  },

  showTopTips(){
    if (this.data.name == "") {
      wx.showModal({
        content: '姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.name, 2, 6)) {
      wx.showModal({
        content: '姓名为2~6个汉字',
        showCancel: false
      });
      return;
    }
    if (this.data.nation == "") {
      wx.showModal({
        content: '民族不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.nation, 1, 5)) {
      wx.showModal({
        content: '民族为1~5个汉字',
        showCancel: false
      });
      return;
    }
    if (this.data.birthDate == "") {
      wx.showModal({
        content: '出生日期不能为空',
        showCancel: false
      });
      return;
    }
    if (this.data.address == "") {
      wx.showModal({
        content: '地址不能为空',
        showCancel: false
      });
      return;
    }
    if (this.data.address.length > 20 || this.data.address.length < 6) {
      wx.showModal({
        content: '地址长度为6~20',
        showCancel: false
      });
      return;
    }
    if (this.data.identityCard == "") {
      wx.showModal({
        content: '身份证不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctIDCard(this.data.identityCard)) {
      wx.showModal({
        content: '请输入正确的身份证',
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
        name: that.data.name,
        gender: that.data.gender,
        nation: that.data.nation,
        birthDate: that.data.birthDate,
        address: that.data.address,
        identityCard: that.data.identityCard
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveInfor);
        } else if (res.data.retCode === "000") {//信息保存成功
          wx.redirectTo({
            url: '../takePhoto/takePhoto?photoType=3'
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
      name: data.name,
      gender: data.gender,
      nation: data.nation,
      birthDate: data.birthDate,
      address: data.address,
      identityCard: data.identityCard
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