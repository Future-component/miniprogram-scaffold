Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    images: [
      "../../assets/images/test.jpg",
    ],
    progress: 1 / 1 * 100
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemchange(e) {
      let {
        current
      } = e.detail

      this.setData({
        progress: (current + 1) / 4 * 100
      })
    }
  }
})