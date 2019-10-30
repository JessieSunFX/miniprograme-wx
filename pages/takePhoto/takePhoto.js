// pages/drivingLicenseFront/drivingLicenseFront.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideCamera:false,
    hideHint:true,
    src:'../../img/pagesBg.jpg',
    originSrc:'../../img/pagesBg.jpg',
    topTitle:'',
    detailTitle:'',
    photoType:'0',
    requestUrl:""
  },
  uploadPhoto() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        upload(that, tempFilePaths);
        that.setData({
          src: tempFilePaths[0],
          hideCamera: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // 获取地址参数，根据参数改变data中的 topTitle / detailTitle 以及页面title  0--行驶正 1--行驶反 2--身份正 3--身份反
    switch (options.photoType) {
      case "0":
        wx.setNavigationBarTitle({
          title: '车辆行驶证'
        });
        this.setData({
          topTitle: '实体行驶证',
          detailTitle: '行驶证主页',
          photoType:'0',
          requestUrl:"uploadIdentifyLicenseFront.json"
        });
        break;
      case "1":
        wx.setNavigationBarTitle({
          title: '车辆行驶证'
        });
        this.setData({
          topTitle: '实体行驶证',
          detailTitle: '行驶证副页',
          photoType: '1',
          requestUrl: "uploadIdentifyLicenseBack.json"
        });
        break;
      case "2":
        wx.setNavigationBarTitle({
          title: '车主身份证'
        });
        this.setData({
          topTitle: '车主身份证',
          detailTitle: '车主身份证正面',
          photoType: '2',
          requestUrl: "uploadIdentifyIDCardFront.json"
        });
        break;
      case "3":
        wx.setNavigationBarTitle({
          title: '车主身份证'
        });
        this.setData({
          topTitle: '车主身份证',
          detailTitle: '车主身份证反面',
          photoType: '3',
          requestUrl:"uploadIdentifyIDCardBack.json"
        });
        break;
       
    }
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
function upload(page, path) {
  wx.showToast({
    icon: "loading",
    title: "上传中"
  });
  wx.uploadFile({
    url: app.globalData.domainName + page.data.requestUrl,
    filePath: path[0],
    name: 'file',
    header: {
        "Content-Type": "multipart/form-data" ,
        "token": wx.getStorageSync('token')
       },
    success: function (res) {
      console.log(res);
      if (res.statusCode != 200) {
        wx.showToast({
          title: '上传失败',
          image: '../../img/fail.png',
          duration: 3000,
          complete() {
            page.setData({
              src: page.data.originSrc,
              hideCamera: false,
              hideHint: false
            })
          }
        });
        return;
      }
      var data = JSON.parse(res.data);
      console.log(data);
      if (data.retCode==="001"){//token过期
        app.getToken(upload(page, path));
      }else if(data.retCode==="000"){//上传识别成功
        wx.setStorageSync('identityInfor', JSON.stringify(data.identityInfor));
        wx.showToast({
          icon: "success",
          title: "上传成功",
          complete() {
            switch (page.data.photoType) {
              case '0':
                wx.redirectTo({
                  url: '../frontDrivingLicenseInfo/frontDrivingLicenseInfo'
                });
                break;
              case '1':
                wx.redirectTo({
                  url: '../backDrivingLicenseInfo/backDrivingLicenseInfo'
                });
                break;
              case '2':
                wx.redirectTo({
                  url: '../frontIdentityCard/frontIdentityCard'
                });
                break;
              case '3':
                wx.redirectTo({
                  url: '../backIdentityCard/backIdentityCard'
                });
                break;
            }
          }
        })
      }else{
        wx.showToast({
          title: '上传失败',
          image: '../../img/fail.png',
          duration: 3000,
          complete() {
            page.setData({
              src: page.data.originSrc,
              hideCamera: false,
              hideHint: false
            })
          }
        });
      }
      
    },
    fail: function (e) {  //超时处理方式：1. 判断返回状态 textStatus == 'timeout' 2. fail时判断用户网络状态
      console.log(e);
      if (e.errMsg.indexOf('timeout')!=-1){//请求超时
        wx.showModal({
          content: '请求超时，请检查网络',
          showCancel: false,
          complete() {
            page.setData({
              src: page.data.originSrc,
              hideCamera: false,
              hideHint: false
            })
          }
        });
      }else{
        wx.showToast({
          title: '上传失败',
          image: '../../img/fail.png',
          duration: 3000,
          complete() {
            page.setData({
              src: page.data.originSrc,
              hideCamera: false,
              hideHint: false
            })
          }
        });
      }
    },
    complete: function () {
      wx.hideToast();  //隐藏Toast
    }
  })
}