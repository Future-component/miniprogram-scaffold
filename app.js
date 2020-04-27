//app.js
import {
  isEmpty
} from './utils/util.js'

App({
  globalData: {
    systemInfo: null,
    userInfo: null
  },

  onLaunch: function(e) {
    this.globalData()
    this.isIpx()
    this.checkScene(e)
    this.trackSrc(e)
  },

  onShow: function (options) {
    this.globalData()
    this.checkUpdate()
    this.checkScene(options)
  },

  checkScene: function(e) {
    if (isEmpty(e) || isEmpty(e.query) || isEmpty(e.query.scene)) {
      return
    }
    this.sceneData = JSON.parse('{"' + decodeURIComponent(e.query.scene).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    console.log(this.sceneData)
  },

  /**
   * 是否是Iphonex
   */
  isIpx: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        let pixelRation = res.windowWidth / res.windowHeight;
        that.globalData.isIpx = !!~res.model.toString().indexOf('iPhone X') || (pixelRation < 0.6)
      },
    })
  },

  trackSrc: function(e) {
    const {
      scene,
      query
    } = e
    if (isEmpty(query)) {
      switch (scene) {
        case 1021:
        case 1043:
        case 1058:
        case 1067:
        case 1074:
        case 1082:
        case 1091:
        case 1102:
          this.track('open_way', {
            enterWay: '公众号'
          })
          break;
        case 1011:
        case 1012:
        case 1013:
          this.track('open_way', {
            enterWay: '常规二维码'
          })
          break;
        case 1036:
        case 1044:
          this.track('open_way', {
            enterWay: '分享卡片'
          })
          break;
      }
    } else {
      this.track('open_way', {
        enterWay: '参数二维码'
      })
    }
  },

  /**
   * 事件追踪
   */
  track: function(eventName, properties) {
    console.info(eventName, properties);
  },

  globalData() {
    this.globalData.originErrorTop = {}
    wx.getSystemInfo({
      success: e => {
        // console.log('getSystemInfo: ', e)
        this.globalData.systemInfo = e
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        custom = this.globalData.Custom = custom.bottom ? custom : {
          bottom: 56,
          top: 24,
        };
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.container = {
          width: e.windowWidth,
          height: e.platform === 'android' ? e.windowHeight : e.windowHeight - this.globalData.CustomBar
        }
      }
    })
  },

  checkUpdate: function() {
    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed((res) => {
      console.log("update.fail", res)
    })
  }
})