const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: '',
    },
    backText: {
      type: String,
      default: '',
    },
    backIcon: {
      type: String,
      default: '',
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },

  attached() {
    // console.log('Custom: ', this.data.Custom)
    this.initData()
  },

  ready() {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initData() {
      if (!app.globalData.CustomBar) {
        wx.showToast({ title: 'CustomBar:' + app.globalData.CustomBar })
        wx.getSystemInfo({
          success: e => {
            app.globalData.StatusBar = e.statusBarHeight;
            let custom = wx.getMenuButtonBoundingClientRect();
            // console.log('custom: ', custom)
            custom = this.globalData.Custom = custom.bottom ? custom : {
              bottom: 56,
              top: 24,
            };
            // custom.bottom - custom.top + custom.top + (custom.top - e.statusBarHeight)
            console.log('customBar-this.globalData.CustomBar: ', custom.bottom, custom.top, e.statusBarHeight)
            app.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            app.globalData.container = {
              width: e.windowWidth,
              height: e.windowHeight - app.globalData.CustomBar
            }
          }
        })
        this.setData({
          StatusBar: app.globalData.StatusBar,
          CustomBar: app.globalData.CustomBar,
          Custom: app.globalData.Custom
        })
      }
    },
    backPage() {
      this.triggerEvent('event', { backUp: true })
      // wx.navigateBack({
      //   delta: 1
      // });
    },
  }
})