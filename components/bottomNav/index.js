Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    PageCur: {
      type: String,
      value: 'home'
    },
    menus: {
      type: Array,
      value: [{
        id: 0,
        key: 'home',
        name: '首页',
        icon: 'shouye',
        pageTo: '/pages/index/index',
      }, {
        id: 1,
        key: 'demo',
        name: 'Demo',
        icon: 'shouye',
        pageTo: '/pages/demo/index',
      }], 
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    PageCur: 'home',
  },
  /**
   * 组件初始化
   */
  attached() {
    const pages = getCurrentPages();
    
    const currentPage = pages[pages.length - 1];
    const curPageUrl = `/${currentPage.route}`
    this.data.menus.forEach((item) => {
      if (item.pageTo === curPageUrl) {
        this.setData({ PageCur: item.key })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    NavChange(e) {
      const PageCur = e.currentTarget.dataset.cur
      const menu = this.data.menus[PageCur]
      if (menu && menu.pageTo) {
        wx.navigateTo({ url: menu.pageTo })
      }
    },
  }
})
