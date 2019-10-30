// pages/myPerformance/myPerformance.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxHeight:0,
    date:'',
    insuranceCompanyList:[
      {
        insuranceCompanyId:'',
        insuranceCompanyName:'全部'
      }
    ],
    insuranceCompanyIndex:-1,

    totalOrders:"",
    totalAmount:"",
    performanceList:[],
    isFromSearch: true,   // 用于判断items数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 20,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    isLoading: false  //正在请求加载数据
  },

  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (!this.data.isLoading){
      this.setData({
        date: e.detail.value,
        searchPageNum: 1,   //第一次加载，设置1
        performanceList: [],  //放置返回数据的数组,设为空
        isFromSearch: true,  //第一次加载，设置true
        searchLoading: true,  //把"上拉加载"的变量设为true，显示
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
      this.fetchSearchList();
    }else{
      wx.showModal({
        content: '加载中，请稍后',
        showCancel: false
      });
    }
  },
  bindInsuranceCompanyChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (!this.data.isLoading) {
      this.setData({
        insuranceCompanyIndex: e.detail.value,
        searchPageNum: 1,   //第一次加载，设置1
        performanceList: [],  //放置返回数据的数组,设为空
        isFromSearch: true,  //第一次加载，设置true
        searchLoading: true,  //把"上拉加载"的变量设为true，显示
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
      this.fetchSearchList();
    } else {
      wx.showModal({
        content: '加载中，请稍后',
        showCancel: false
      });
    }
  },
  //搜索，访问网络
  fetchSearchList: function () {
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      complete() {
        that.setData({
          isLoading: true //正在请求加载数据设置为true
        })
      }
    });
    app.myReq({
      url: "performanceList.json",
      data: {
        date: that.data.date,
        insuranceCompanyId: that.data.insuranceCompanyIndex == -1 ? "" : that.data.insuranceCompanyList[that.data.insuranceCompanyIndex].insuranceCompanyId,
        searchPageNum: that.data.searchPageNum,
        callbackcount: that.data.callbackcount
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.fetchSearchList);
        } else if (res.data.retCode === "000") {//请求成功
          //判断是否有数据，有则取数据
          if (res.data.performanceList.length != 0) {
            let performanceList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? performanceList = res.data.performanceList : performanceList = that.data.performanceList.concat(res.data.performanceList);  //TODO ...............
            that.setData({
              totalOrders: res.data.totalOrders,
              totalAmount: res.data.totalAmount,
              performanceList: performanceList, //获取数据数组
              searchLoading: true,   //把"上拉加载"的变量设为true，显示
              isLoading: false //正在请求加载数据设置为false
            });

          } else {//没有数据了，把“没有数据”显示，把“上拉加载”隐藏
            that.setData({
              totalOrders: res.data.totalOrders,
              totalAmount: res.data.totalAmount,
              searchLoadingComplete: true, //把“没有数据”设为true，显示
              searchLoading: false,  //把"上拉加载"的变量设为false，隐藏
              isLoading: false //正在请求加载数据设置为false
            });
          }
        } else {//请求失败
          console.log('fetchSearchList失败!');
          wx.showToast({
            title: '加载失败',
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
        console.log('fetchSearchList失败' + res.errMsg);
        wx.showToast({
          title: '加载失败',
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
        title: '加载失败',
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
  //滚动到底部触发事件
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete && !that.data.isLoading) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.fetchSearchList();
    }
  },
  requestInsuranceCompany(){
    let that = this;
    app.myReq({
      url: "insuranceCompanyList.json",
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestInsuranceCompany);
        } else if (res.data.retCode === "000") {//请求成功
          let insuranceCompanyList = res.data.insuranceCompanyList;
          let insuranceCompanyListNew = that.data.insuranceCompanyList.concat(insuranceCompanyList);
          that.setData({
            insuranceCompanyList: insuranceCompanyListNew
          })
        } else {//请求失败
          console.log('requestInsuranceCompany失败!');
        }
      } else {
        console.log('requestInsuranceCompany失败' + res.errMsg);
      }
    }).catch(err => {
      console.log(err);
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1));
    let res = wx.getSystemInfoSync();
    let boxHeight = res.windowHeight - 88;
    this.setData({
      boxHeight: boxHeight,
      date:date
    });
    this.requestInsuranceCompany();
    this.fetchSearchList();
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