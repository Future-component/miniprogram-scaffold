import { takePhoto, chooseImage } from '../../utils/wxUtils'

const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    position: {
      type: String,
      value: 'back'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    position: 'back',
    container: app.globalData.container,

    distance: 0, // 手指移动的距离
    scale: 1, // 图片的比例
    maxZoom: 0,
  },

  attached() {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeCamera() {
      this.triggerEvent('event', {
        ocrStep: 0,
      })
    },
    chooseImage() {
      chooseImage({ sourceType: ['album'] }, this).then((res) => {
        const originImgPath = res.tempFilePaths[0]
        this.triggerEvent('event', {
          originImgPath,
        }) 
      })
    },
    switchCameraPosition() {
      if (this.data.position === 'front') {
        this.setData({ position: 'back' })
      } else {
        this.setData({ position: 'front' })
      }
    },
    takePhoto() {
      takePhoto(this).then((res) => {
        const originImgPath = res.tempImagePath
        this.triggerEvent('event', {
          originImgPath,
        }) 
      })
    }, 
    initCamera(res) {
      console.log('initCamera-res: ', res)
      this.setData({
        maxZoom: res.detail.maxZoom,
      })
    },
    cameraError() {
      wx.showToast({
        title: '相机调用失败',
        icon: 'none',
      })
    },
    /**
     * 双手指触发开始 计算开始触发两个手指坐标的距离
     */
    touchstartCallback: function(e) {
      this.setData({
        maxZoom: 'start' + e.touches.length
      })
      // 单手指缩放开始，不做任何处理
      if (e.touches.length == 1) return;
      // 当两根手指放上去的时候，将距离(distance)初始化。
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      // 计算开始触发两个手指坐标的距离
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      this.setData({
        'distance': distance,
      })
    },
    /**
     * 双手指移动   计算两个手指坐标和距离
     */
    touchmoveCallback: function(e) {
      this.setData({
        maxZoom: '移动'
      })
      // 单手指缩放不做任何操作
      if (e.touches.length == 1) return;
      // 双手指运动 x移动后的坐标和y移动后的坐标
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      // 双手指运动新的 ditance
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      // 计算移动的过程中实际移动了多少的距离
      let distanceDiff = distance - this.data.distance;
      let newScale = this.data.scale + 0.005 * distanceDiff

      this.setData({
        'distance': distance,
        'scale': newScale,
        'diff': distanceDiff,
        maxZoom: newScale,
      })
    },
    setZoom(value) {
      const ctx = wx.createCameraContext(this)
      if (value > 1 && value <= this.data.maxZoom) {
        ctx.setZoom({
          zoom: value,
          success: (res) => {
            console.log('success: ', res)
          },
          fail: (err) => {
            console.log('fail: ', err)
          },
          complete: (res) => {
            console.log('complete: ', res)
          },
        })
      }
    },
  }
})
