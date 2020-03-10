Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    nodes: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    nodes: [],
  },

  /**
   * 组件初始化
   */
  attached() {
  },

  ready() {
    console.log('ready')
    this.initData() 
  },

  created() {
    console.log("created")
  },

  moved() {
    console.log('moved')
  },

  detached() {
    console.log('detached')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateProps(dataCur) {
      this.triggerEvent('event', { dataCur }, { source: 'richText' })
    },
    clickHandler(e) {
      const cur = e.currentTarget.dataset.cur
      if (cur) {
        this.updateProps(cur)
      }
    },
    initData() {
    },
  }
})
