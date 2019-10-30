// pages/bankCardInfor/bankCardInfor.js
const app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountName:'',//开户姓名 2-6个汉字
    bankCardNumber:'',//银行卡号 仅支持‘60’‘62’开头的银联标准卡
    depositBankList:[
      "中国工商银行",
      "招商银行",
      "中国农业银行",
      "中国建设银行",
      "中国银行",
      "中国民生银行",
      "中国光大银行",
      "中信银行",
      "交通银行",
      "兴业银行"
    ],
    depositBankIndex:-1,
    branchName:'',//支行名称 2-10个汉字
    identityCard:''//身份证号

  },
  accountNameBlur(e){
    if (e.detail.value === this.data.accountName) {//未进行任何修改编辑
      return;
    }
    this.setData({
      accountName: e.detail.value
    })
    if (!this.data.accountName){
      wx.showModal({
        content: '开户姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.accountName,2,6)) {//验证不成功
      wx.showModal({
        content: '开户姓名为2~6个汉字',
        showCancel: false
      });
    } 
  },
  bankCardNumberBlur(e){
    if (e.detail.value === this.data.bankCardNumber) {//未进行任何修改编辑
      return;
    }
    this.setData({
      bankCardNumber: e.detail.value
    })
    if (!this.data.bankCardNumber){
      wx.showModal({
        content: '银行卡号不能为空',
        showCancel: false
      });
      return;
    }
    if (this.data.bankCardNumber.indexOf('60') != 0 && this.data.bankCardNumber.indexOf('62') != 0) {//验证不成功
      wx.showModal({
        content: '仅支持‘60’‘62’开头的银联标准卡',
        showCancel: false
      });
    } 
  },
  branchNameBlur(e){
    if (e.detail.value === this.data.branchName) {//未进行任何修改编辑
      return;
    }
    this.setData({
      branchName: e.detail.value
    })
    if (!this.data.branchName) {
      wx.showModal({
        content: '支行名称不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.branchName, 2, 10)) {//验证不成功
      wx.showModal({
        content: '支行名称为2~10个汉字',
        showCancel: false
      });
    } 
  },
  identityCardBlur(e) {
    if (e.detail.value === this.data.identityCard) {//未进行任何修改编辑
      return;
    }
    this.setData({
      identityCard: e.detail.value
    })
    if (!this.data.identityCard) {
      wx.showModal({
        content: '身份证不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctIDCard(this.data.identityCard)) {//验证不成功
      wx.showModal({
        content: '请输入正确的身份证',
        showCancel: false
      });
    }
  },
  bindDepositBankChange(e){
    console.log(e.detail.value);
    this.setData({
      depositBankIndex: e.detail.value
    })
  },
  saveBankCardInfor(){
    if (!this.data.accountName) {
      wx.showModal({
        content: '开户姓名不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.accountName, 2, 6)) {//验证不成功
      wx.showModal({
        content: '开户姓名为2~6个汉字',
        showCancel: false
      });
      return;
    } 
    if (!this.data.bankCardNumber) {
      wx.showModal({
        content: '银行卡号不能为空',
        showCancel: false
      });
      return;
    }
    if (this.data.bankCardNumber.indexOf('60') != 0 && this.data.bankCardNumber.indexOf('62') != 0) {//验证不成功
      wx.showModal({
        content: '仅支持‘60’‘62’开头的银联标准卡',
        showCancel: false
      });
      return;
    } 
    if (this.data.depositBankIndex==-1){
      wx.showModal({
        content: '请选择开户银行',
        showCancel: false
      });
      return;
    }
    if (!this.data.branchName) {
      wx.showModal({
        content: '支行名称不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.characterLengthJudge(this.data.branchName, 2, 10)) {//验证不成功
      wx.showModal({
        content: '支行名称为2~10个汉字',
        showCancel: false
      });
      return;
    } 
    if (!this.data.identityCard) {
      wx.showModal({
        content: '身份证不能为空',
        showCancel: false
      });
      return;
    }
    if (!util.correctIDCard(this.data.identityCard)) {//验证不成功
      wx.showModal({
        content: '请输入正确的身份证',
        showCancel: false
      });
      return;
    }
    this.saveInfor();
  },
  requestInfor() {
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    app.myReq({
      url: "getBankCardInfor.json",
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestInfor);
        } else if (res.data.retCode === "000") {//请求成功
          let depositBankIndex = that.data.depositBankIndex;
          for (let i = 0; i < that.data.depositBankList.length;i++){
            if (that.data.depositBankList[i] == res.data.depositBank){
              depositBankIndex=i;
              break;
            }
          }
          that.setData({
            accountName: res.data.accountName,
            bankCardNumber: res.data.bankCardNumber,
            depositBankIndex: depositBankIndex,
            branchName: res.data.branchName,
            identityCard: res.data.identityCard
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
  saveInfor(){
    let that = this;
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    });
    app.myReq({
      url: "saveBankCardInfor.json",
      data:{
        accountName: that.data.accountName,
        bankCardNumber: that.data.bankCardNumber,
        depositBank: that.data.depositBankList[that.data.depositBankIndex],
        branchName: that.data.branchName,
        identityCard: that.data.identityCard
      },
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.saveInfor);
        } else if (res.data.retCode === "000") {//保存成功
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 3000
          });
        } else {//保存失败
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
    this.requestInfor();
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