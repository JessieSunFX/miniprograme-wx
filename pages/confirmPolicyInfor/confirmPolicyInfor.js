// pages/confirmPolicyInfor/confirmPolicyInfor.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCost:"",

    insuredPersonSwitch: true,
    insuredPersonDetail:{},

    policyHolderSwitch:true,
    policyHolderDetail:{},

    vehicleInforSwitch:true,
    vehicleInforDetail:{},

    carOwnerInforSwitch:true,
    carOwnerInforDetail:{},

    commercialInsuranceSwitch:true,
    commercialInsuranceDetail:{}
  },
  switchInsuredPersonChange(e) {
    this.setData({
      insuredPersonSwitch: e.detail.value
    })
  },
  switchPolicyHolderChange(e) {
    this.setData({
      policyHolderSwitch: e.detail.value
    })
  },
  switchVehicleInforChange(e) {
    this.setData({
      vehicleInforSwitch: e.detail.value
    })
  },
  switchCarOwnerInforChange (e){
    this.setData({
      carOwnerInforSwitch: e.detail.value
    })
  },
  switchCommercialChange (e){
    this.setData({
      commercialInsuranceSwitch:e.detail.value
    })
  },
  requestConfirmInfor(){
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    let that = this;
    app.myReq({
      url: "confirmInfor.json",
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestConfirmInfor);
        } else if (res.data.retCode === "000") {//请求成功
          that.setData({
            totalCost: res.data.totalCost,
            insuredPersonDetail: res.data.insuredPersonDetail,
            policyHolderDetail: res.data.policyHolderDetail,
            vehicleInforDetail: res.data.vehicleInforDetail,
            carOwnerInforDetail: res.data.carOwnerInforDetail,
            commercialInsuranceDetail: res.data.commercialInsuranceDetail
          })
        } else {//请求失败
          console.log('requestConfirmInfor失败!');
          wx.showToast({
            title: '加载失败',
            image: '../../img/fail.png',
            duration: 3000
          });
        }

      } else {
        console.log('requestConfirmInfor失败' + res.errMsg);
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
    this.requestConfirmInfor();
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