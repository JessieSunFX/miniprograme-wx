// pages/myClient/myClient.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxHeight:0,
    inputShowed: false,
    searchKeyword: "",//需要搜索的字符
    clientList: [],//放置返回数据的数组
    isFromSearch: true,   // 用于判断items数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 20,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    isLoading: false  //正在请求加载数据
  },
  inputTyping: function (e) {
    if (!this.data.isLoading) {
      this.setData({
        searchKeyword: e.detail.value,
        searchPageNum: 1,   //第一次加载，设置1
        clientList: [],  //放置返回数据的数组,设为空
        isFromSearch: true,  //第一次加载，设置true
        searchLoading: true,  //把"上拉加载"的变量设为true，显示
        searchLoadingComplete: false //把“没有数据”设为false，隐藏
      })
      this.fetchSearchList();
    }
  },
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
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数
        searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数
        callbackcount = that.data.callbackcount; //返回数据的个数
    app.myReq({
      url: "myClientList.json",
      data: {
        searchKeyword: searchKeyword,
        searchPageNum: searchPageNum,
        callbackcount: callbackcount
      }
    }).then(res => {
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.fetchSearchList);
        } else if (res.data.retCode === "000") {//搜索请求成功
          console.log(res.data);
          //判断是否有数据，有则取数据
          if (res.data.clientList.length != 0) {
            let clientList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            that.data.isFromSearch ? clientList = res.data.clientList : clientList = that.data.clientList.concat(res.data.clientList);  //TODO ...............
            that.setData({
              clientList: clientList, //获取数据数组
              searchLoading: true,   //把"上拉加载"的变量设为true，显示
              isLoading: false //正在请求加载数据设置为false
            });

          } else {//没有数据了，把“没有数据”显示，把“上拉加载”隐藏
            that.setData({
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
          title: '请求失败',
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
        title: '请求失败',
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
  clearInput: function () {
    if (!this.data.isLoading) {
      this.setData({
        searchKeyword: '',
        inputShowed: false,
        searchPageNum: 1,   //第一次加载，设置1
        clientList: [],  //放置返回数据的数组,设为空
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
        searchKeyword: '',
        inputShowed: false,
        searchPageNum: 1,   //第一次加载，设置1
        clientList: [],  //放置返回数据的数组,设为空
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
    if (!that.data.isLoading && that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.fetchSearchList();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let res = wx.getSystemInfoSync();
    wx.createSelectorQuery().select('.topBox').boundingClientRect(function (rect) {
      let topHeight = Number(rect.height) // 节点的高度
      that.setData({
        boxHeight: Number(res.windowHeight) - topHeight
      });
    }).exec();
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