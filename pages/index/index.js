const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '首页' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options: ', options)
  },

  onPageScroll: function(e) {
    console.log('e: ', e, e.scrollTop) 
  },

  jump: function() {
    wx.redirectTo({
      url: '../demo/index',
      fail: function(res) {
        console.log(res)
      },
      success: function(res) {
        console.log(res)
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '首页',
      path: '/pages/index/index',
      imageUrl: '../../assets/images/test.jpg'
    }
  },
})