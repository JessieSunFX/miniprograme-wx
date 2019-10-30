// pages/diamondExchange/diamondExchange.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topHintHide:true,
    diamondBalance: "",
    diamondWithdrawal: "xxxx",
    estimatedTime: "xxxx-xx-xx",
    payeeName: "",
    depositBank: "",
    bankCardNumber: "",
    
    inputNum: '',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    orientation: 'left',//滚动方向
    interval: 20, // 时间间隔
    showConfirmModal: false
  },
  isNumberBy100(num) {
    var re = /^[0-9]*[0-9]$/i; //校验是否为数字
    if (re.test(num) && num % 100 === 0) {
      return true;
    } else {
      return false;
    }
  },
  bindInputFun(e) {
    this.setData({
      inputNum: e.detail.value
    })
  },
  immediateExchange() {
    console.log();
    if (!this.isNumberBy100(parseFloat(this.data.inputNum))) {
      console.log('兑换金额必须为100的整数')
      wx.showModal({
        content: '兑换金额必须为100的整数',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else if (parseFloat(this.data.inputNum) > parseFloat(this.data.diamondBalance)) {
      console.log('兑换金额不可大于可兑换余额')
      wx.showModal({
        content: '兑换金额不可大于可兑换余额',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      if (this.data.payeeName && this.data.depositBank && this.data.bankCardNumber) {
        // 最终确认兑换信息
        this.setData({
          showConfirmModal: true
        })
      } else {// 未设置银行卡信息
        wx.showModal({
          content: '请先设置您的个人银行卡信息',
          confirmText: '确定',
          cancelText: '取消',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }
  },
  clearConfirmModal() {
    this.setData({
      showConfirmModal: false
    })
  },
  confirmInfor() {
    console.log('用户点击了confirm按钮');
    this.requestExchangeDiamond();
  },
  requestExchangeDiamond(){
    let that = this;
    wx.showToast({
      title: '兑换中',
      icon: 'loading'
    });
    app.myReq({
      url: "exchangeDiamond.json",
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestExchangeDiamond);
        } else if (res.data.retCode === "000") {//请求成功
          wx.showToast({
            title: '兑换成功',
            image: '../../img/fail.png',
            duration: 3000,
            complete(){
              that.setData({
                showConfirmModal: false
              })
            }
          });
        } else {//请求失败
          console.log('requestExchangeDiamond失败!');
          wx.showToast({
            title: '兑换失败',
            image: '../../img/fail.png',
            duration: 3000,
            complete() {
              that.setData({
                showConfirmModal: false
              })
            }
          });
        }

      } else {
        console.log('requestExchangeDiamond失败' + res.errMsg);
        wx.showToast({
          title: '兑换失败',
          image: '../../img/fail.png',
          duration: 3000,
          complete() {
            that.setData({
              showConfirmModal: false
            })
          }
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '兑换失败',
        image: '../../img/fail.png',
        duration: 3000,
        complete() {
          that.setData({
            showConfirmModal: false
          })
        }
      });
    })
  },
  requestInfor() {
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    app.myReq({
      url: "getExchangeInfor.json",
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestInfor);
        } else if (res.data.retCode === "000") {//请求成功
          that.setData({
            diamondBalance: res.data.diamondBalance,
            diamondWithdrawal: res.data.diamondWithdrawal,
            estimatedTime: res.data.estimatedTime,
            payeeName: res.data.payeeName,
            depositBank: res.data.depositBank,
            bankCardNumber: res.data.bankCardNumber
          })
          if (parseFloat(res.data.diamondWithdrawal) > 0 && res.data.estimatedTime) {//存在提现中的钻石
            var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
            wx.createSelectorQuery().select('.marquee_text').boundingClientRect(function (rect) {
              let textWidth = Number(rect.width) // 文字长度
              that.setData({
                length: textWidth,
                windowWidth: windowWidth,
                topHintHide:false
              });
              if (textWidth > windowWidth - 30) {
                setTimeout(function () {
                  that.run();// 水平一行字滚动完了再按照原来的方向滚动
                }, 1000);
              }
            }).exec();
          }
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
    this.requestInfor();
  },
  run: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance < vm.data.length) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.run();
      }
    }, vm.data.interval);
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