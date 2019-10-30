// pages/insuranceDetails/insuranceDetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:false,//正在请求

    scrollTop:0,

    hideTotalCost:false,

    menuTop:0,

    animation:'',

    normalStatus:true,


    offerInstitution:"",

    commercialInsurance:"",
    compulsoryInsurance:"",
    vehicleVesselTax:"",
    totalCost:"",

    commercialInsuranceSwitch: true,
    commercialInsuranceEffectiveDate:"",
    commercialInsuranceList:[],

    compulsoryInsuranceSwitch:true,
    compulsoryInsuranceEffectiveDate:"",
    compulsoryInsuranceList:[]
  },
  scroll(e) {
    console.log(e.detail.scrollTop);
    var that=this;
    if (e.detail.scrollTop > this.data.scrollTop){
        console.log('上滑');
      if (this.data.hideTotalCost == false && this.data.scrollTop > 0 && this.data.scrollTop<this.data.menuTop/2){
        this.animation.opacity(0).step();
        this.setData({
          animation: this.animation.export()
        })
        setTimeout(function(){
          that.setData({
            hideTotalCost: true
          })
        },400) 
      }
        
    } else if (e.detail.scrollTop < this.data.scrollTop){
        console.log('下滑');
      if (this.data.hideTotalCost == true && this.data.scrollTop > 0 && this.data.scrollTop < this.data.menuTop/2) {
        that.setData({
          hideTotalCost: false
        })
        this.animation.opacity(1).step();
        this.setData({
          animation: this.animation.export()
        })
      }
    }
    this.setData({
      scrollTop: e.detail.scrollTop
    })


  },
  switchCommercialChange (e){
    this.setData({
      commercialInsuranceSwitch: e.detail.value
    });
  },
  switchCompulsoryChange (e){
    this.setData({
      compulsoryInsuranceSwitch: e.detail.value
    });
  },
  requestOptionalOffer(){
    let commercialInsuranceList = [];
    for (let i = 0; i < this.data.commercialInsuranceList.length; i++) {
      commercialInsuranceList.push({
        insuranceId: this.data.commercialInsuranceList[i].insuranceId,
        insuranceCoverageId: this.data.commercialInsuranceList[i].insuranceCoverageList[this.data.commercialInsuranceList[i].selectedCoverageIdx].insuranceCoverageId
      })
    }
    let compulsoryInsuranceList = [];
    for (let j = 0; j < this.data.compulsoryInsuranceList.length; j++) {
      compulsoryInsuranceList.push({
        insuranceId: this.data.compulsoryInsuranceList[j].insuranceId,
        insuranceCoverageId: this.data.compulsoryInsuranceList[j].insuranceCoverageList[this.data.compulsoryInsuranceList[j].selectedCoverageIdx].insuranceCoverageId
      })
    }
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
      url: "getOptionalOffer.json",
      data: {
        commercialInsuranceList: commercialInsuranceList,
        compulsoryInsuranceList: compulsoryInsuranceList
      }
    }).then(res => {
      console.log(res);
      if (res.statusCode === 200) {
        if (res.data.retCode === "001") {//token过期
          app.getToken(that.requestOptionalOffer);
        } else if (res.data.retCode === "000") {//请求成功
          that.setData({
            commercialInsurance: res.data.commercialInsurance,
            compulsoryInsurance: res.data.compulsoryInsurance,
            vehicleVesselTax: res.data.vehicleVesselTax,
            totalCost: res.data.totalCost,
            isLoading:false,
            normalStatus:true
          })
        } else {//请求失败
          console.log('requestOptionalOffer失败!');
          wx.showToast({
            title: '获取自选报价失败',
            image: '../../img/fail.png',
            duration: 3000,
            complete() {
              that.setData({
                isLoading: false, //正在请求加载数据设置为false
                normalStatus:true
              })
            }
          });
        }

      } else {
        console.log('requestOptionalOffer失败' + res.errMsg);
        wx.showToast({
          title: '获取自选报价失败',
          image: '../../img/fail.png',
          duration: 3000,
          complete() {
            that.setData({
              isLoading: false, //正在请求加载数据设置为false
              normalStatus: true
            })
          }
        });
      }
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '获取自选报价失败',
        image: '../../img/fail.png',
        duration: 3000,
        complete() {
          that.setData({
            isLoading: false, //正在请求加载数据设置为false
            normalStatus: true
          })
        }
      });
    })
  },
  requote(){//重新请求报价方法
    if (!this.data.isLoading){
      this.requestOptionalOffer();
    }
  },
  bindCoverageChange (e){
    console.log(e.detail.value);
    let index = e.currentTarget.dataset.idx;
    let oldData;
    if (e.currentTarget.dataset.id==1){//商业险
      if (this.data.commercialInsuranceList[index]["selectedCoverageIdx"] == e.detail.value){//未改变
        return;
      }
      oldData = 'commercialInsuranceList[' + index + '].selectedCoverageIdx';
    } else if (e.currentTarget.dataset.id == 2){//强制险
      if (this.data.compulsoryInsuranceList[index]["selectedCoverageIdx"] == e.detail.value) {//未改变
        return;
      }
      oldData = 'compulsoryInsuranceList[' + index + '].selectedCoverageIdx';
    }
    this.setData({
      [oldData]: e.detail.value,
      normalStatus:false
    })
  },
  nextBtn(){
    wx.redirectTo({
      url: "../confirmPolicyInfor/confirmPolicyInfor"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(wx.getStorageSync('insuranceDetail'));
    this.setData({
      offerInstitution: data.offerInstitution,
      commercialInsurance: data.commercialInsurance,
      compulsoryInsurance: data.compulsoryInsurance,
      vehicleVesselTax: data.vehicleVesselTax,
      totalCost: data.totalCost,
      commercialInsuranceEffectiveDate: data.commercialInsuranceDetail.effectiveDate,
      commercialInsuranceList: data.commercialInsuranceDetail.insuranceTypeList,
      compulsoryInsuranceEffectiveDate: data.compulsoryInsuranceDetail.effectiveDate,
      compulsoryInsuranceList: data.compulsoryInsuranceDetail.insuranceTypeList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    //实例化一个动画
    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 400,
      timingFunction: 'linear',
      success: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    var query = wx.createSelectorQuery()//创建节点查询器 query

    query.select('#affix').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求

    query.exec(function (res) {

      console.log(res[0].top); // #affix节点的上边界坐

      that.setData({

        menuTop: res[0].top

      })

    });
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