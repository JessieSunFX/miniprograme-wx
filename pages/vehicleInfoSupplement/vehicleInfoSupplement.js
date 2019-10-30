// pages/vehicleInfoSupplement/vehicleInfoSupplement.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectVehicleSummaryId:"",
    topDistance:'',
    licenseNumber:"",
    brandModel:"",
    inputShowed: false,
    searchKeyword: "",//需要搜索的字符
    searchList: [],//放置返回数据的数组
    isFromSearch: true,   // 用于判断searchList数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 20,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    isLoading:false  //正在请求加载数据
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      selectVehicleSummaryId:e.detail.value
    })
  },
  inputTyping: function (e) {
    if (!this.data.isLoading){
      this.setData({
        searchKeyword: e.detail.value,
        searchPageNum: 1,   //第一次加载，设置1
        searchList: [],  //放置返回数据的数组,设为空
        isFromSearch: true,  //第一次加载，设置true
        searchLoading: true,  //把"上拉加载"的变量设为true，显示
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
      this.fetchSearchList();
    }
  },
  //搜索，访问网络
  fetchSearchList: function () {
    let that = this;
    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      complete() {
        that.setData({
          isLoading: true //正在请求加载数据设置为true
        })
      }
    });
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数
        searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数
        callbackcount = that.data.callbackcount; //返回数据的个数
    app.myReq({
      url: "searchSummary.json",
      data: {
        searchKeyword: searchKeyword,
        searchPageNum: searchPageNum,
        callbackcount: callbackcount
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.fetchSearchList);
        } else if (res.data.retCode === "000") {//搜索请求成功
          //判断是否有数据，有则取数据
          if (res.data.searchList.length != 0) {
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? searchList = res.data.searchList : searchList = that.data.searchList.concat(res.data.searchList);  //TODO ...............
            that.setData({
              licenseNumber: res.data.licenseNumber,
              brandModel: res.data.brandModel,
              searchList: searchList, //获取数据数组
              searchLoading: true,   //把"上拉加载"的变量设为true，显示
              isLoading: false //正在请求加载数据设置为false
            });

          } else {//没有数据了，把“没有数据”显示，把“上拉加载”隐藏
            that.setData({
              licenseNumber: res.data.licenseNumber,
              brandModel: res.data.brandModel,
              searchLoadingComplete: true, //把“没有数据”设为true，显示
              searchLoading: false,  //把"上拉加载"的变量设为false，隐藏
              isLoading: false //正在请求加载数据设置为false
            });
          }
        } else {//搜索请求失败
          console.log('fetchSearchList失败!');
          wx.showToast({
            title: '请求失败',
            image: '../../img/fail.png',
            duration: 3000,
            complete(){
              that.setData({
                isLoading: false //正在请求加载数据设置为false
              })
            }
          });
        }

      } else {
        console.log('fetchSearchList失败' + res.errMsg);
        wx.showToast({
          title: '请求失败',
          image: '../../img/fail.png',
          duration: 3000,
          complete(){
            that.setData({
              isLoading: false //正在请求加载数据设置为false
            })
          }
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '请求失败',
        image: '../../img/fail.png',
        duration: 3000,
        complete(){
          that.setData({
            isLoading: false //正在请求加载数据设置为false
          })
        }
      });
    })
  },
  clearInput: function () {
    if (!this.data.isLoading) {
      this.setData({
        searchKeyword: "",
        searchPageNum: 1,   //第一次加载，设置1
        searchList: [],  //放置返回数据的数组,设为空
        isFromSearch: true,  //第一次加载，设置true
        searchLoading: true,  //把"上拉加载"的变量设为true，显示
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
      this.fetchSearchList();
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    if (!this.data.isLoading) {
      this.setData({
        searchKeyword: "",
        inputShowed: false,
        searchPageNum: 1,   //第一次加载，设置1
        searchList: [],  //放置返回数据的数组,设为空
        isFromSearch: true,  //第一次加载，设置true
        searchLoading: true,  //把"上拉加载"的变量设为true，显示
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
      this.fetchSearchList();
    }
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    console.log('searchScrollLower');
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete && !that.data.isLoading) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.fetchSearchList();
    }
  },
  tapNextBtn:function(){
    if (!this.data.isLoading){
      this.requestInsuranceDetail();
     }
  },
  requestInsuranceDetail() {
    wx.showToast({
      title: '报价生成中',
      icon: 'loading',
      complete() {
        that.setData({
          isLoading: true //正在请求加载数据设置为true
        })
      }
    });
    let that = this;
    app.myReq({
      url: "insuranceDetail.json",
      data: {
        licenseNumber: that.data.licenseNumber,
        brandModel: that.data.brandModel,
        vehicleSummaryId: that.data.vehicleSummaryId
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestInsuranceDetail);
        } else if (res.data.retCode === "000") {//请求成功
          wx.setStorageSync('insuranceDetail', JSON.stringify(res.data.insuranceDetail));
          wx.redirectTo({
            url: "../insuranceDetails/insuranceDetails"
          });
        } else if (res.data.retCode === "111"){//无法获取报价
          wx.showModal({
            content: '车辆摘要信息有误',
            showCancel: false,
            complete(){
              that.setData({
                isLoading: false //正在请求加载数据设置为false
              })
            }
          });
        }else {//请求失败
          console.log('requestInsuranceDetail失败!');
          wx.showToast({
            title: '获取报价失败',
            image: '../../img/fail.png',
            duration: 3000,
            complete() {
              that.setData({
                isLoading: false //正在请求加载数据设置为false
              })
            }
          });
        }

      } else {
        console.log('requestInsuranceDetail失败' + res.errMsg);
        wx.showToast({
          title: '获取报价失败',
          image: '../../img/fail.png',
          duration: 3000,
          complete() {
            that.setData({
              isLoading: false //正在请求加载数据设置为false
            })
          }
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '获取报价失败',
        image: '../../img/fail.png',
        duration: 3000,
        complete() {
          that.setData({
            isLoading: false //正在请求加载数据设置为false
          })
        }
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.createSelectorQuery().select('.topBox').boundingClientRect(function (rect) {
      let topDistance = Number(rect.height) // 节点的高度
      that.setData({
        topDistance: topDistance
      });
    }).exec();
    that.fetchSearchList();
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