import { isArray, isFunction } from '../../utils/lodash'
import { formatOptions, formatCoorectResults } from '../../utils/helper'
import CanvasApplication from '../../utils/canvasApplication'
import { downLoadImg } from '../../utils/wxUtils'
// import img from '../../assets/images/test.jpg'
import ErrorType from '../../utils/correctErrorType'

const app = getApp();

Component({
    options: {
      addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
      render: {
        type: Function,
        value: (rc) => { console.log('render', rc) },
      },
      params: {
        type: Array,
        value: [
            ['rectangle', [10, 10, 100, 40, { fill: 'red' }]]
        ]
      },
      id: {
        type: String,
        value: 'roughCanvas'
      },
    },
  
    /**
     * 组件的初始数据
     */
    data: {
        style: {
            autoHeight: 60,
            lineHeight: 20,
            sortCount: 1,
            autoSort: false,
        },
    },
    /**
     * 组件初始化
     */
    attached() {
      console.log('data: ', this.data)
      this.initRough()
    },
    /**
     * 组件的方法列表
     */
    methods: {
        initRough() {
            const width = app.globalData.systemInfo.windowWidth - 20
            const height = app.globalData.systemInfo.windowHeight
            this.setData({ width, height })

            this.canvas = new CanvasApplication({ width, height, id: this.data.id }, this)
            this.canvas.init()

            console.log('this.canvas: ', this.canvas)

            // this.rc = new CanvasApplication({ id: this.data.id }, this)
            this.rc = {}

            this.startDraw()
        },
        startDraw() {
            this.renderDemo()
            if (this.data.render) {
                this.data.render(this.rc)
            }

            if (!this.rc || !this.data.params) return null

            this.data.params.forEach((item, index) => {
                if (item.render) {
                    item.render(this.rc)
                } else if (isArray(item) && (isFunction(item[0]))) {
                    const func = isFunction(item[0]) ? item[0] : item[1]
                    func(this.rc)
                } else if (isArray(item) && this.rc[item[0]]) {
                    const options = formatOptions(index, item[0], item[1], this.data.style)
                    this.draw(item[0], options)
                } else if (this.rc[item.type]) {
                    const options = formatOptions(index, item.type, item.options, this.data.style)
                    this.draw(item.type, options)
                }
            })
        },
        draw(type, options) {
            // console.log(type, options)
            this.rc[type](...options)
        },
        renderDemo() {
            // this.canvas.line(0, 50, 100, 50, { stroke: 'blue' })
            // this.canvas.rectangle(0, 100, 50, 30, { fill: 'green', lineWidth: 4 })
            // this.canvas.ellipse(0, 0, 100, 50, { stroke: 'red', lineWidth: 5 })
            // this.canvas.linearPath([[110, 10], [190, 20], [150, 120], [190, 100]], { strokeWidth: 1 })
            // this.canvas.polygon([[110, 10], [190, 20], [150, 120], [190, 100]], { strokeWidth: 1, fill: 'red' })
            // this.canvas.arc(100, 100, 100, 80, Math.PI, Math.PI * 1.6, false, { fill: 'red' })
            // this.canvas.arc(100, 100, 100, 80, Math.PI, Math.PI * 1.6, true, { fill: 'red' })
            // this.canvas.arc(100, 100, 100, 80, -Math.PI * 2, -Math.PI / 2, true, { stroke: 'red', strokeWidth: 4, fill: 'rgba(255,255,0,0.4)' })
            // this.canvas.arc(100, 100, 100, 50, 0, Math.PI / 4, false, { stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(0, 0, 100, 50, -Math.PI / 2, Math.PI / 4, false, { stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { rotate: -40, stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { rotate: -30, stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { rotate: -20, stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { rotate: -10, stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: false })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { rotate: 20, stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { rotate: 30, stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, -Math.PI / 2, Math.PI / 4, false, { rotate: 40, stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.arc(100, 100, 100, 50, Math.PI, Math.PI * 0.8, false, { stroke: 'blue', strokeWidth: 2, fill: 'rgba(255,0,255,0.4)', center: true })
            // this.canvas.circle(100, 100, 5, { fill: 'red', center: true })
            // this.canvas.fan(100, 100, 100, 0, Math.PI  * 1.5, false, { startProportion: 0, endProportion: 1 / 4, fill: 'red', stroke: 'black', lineWidth: 3, })

            // downLoadImg('http://127.0.0.1:8081/test1.jpeg').then((res) => {
            //     console.log('download: ', res)
            //     this.canvas.drawImage(res.path, { x: 0, y: 0, width: this.data.width, height: this.data.width * res.height / res.width })

            //     const prp = this.data.width / res.width
            //     var p1 = {x: 68 * prp, y: 106 * prp}
            //     var p2 = {x: 80 * prp, y: 222 * prp}
            //     var p3 = {x: 757 * prp, y: 140 * prp}
            //     var p4 = {x: 756 * prp, y: 188 * prp}
            
            //     const hr1 = (p2.y - p1.y) / 2
            //     const hr2 = (p4.y - p3.y) / 2
            //     const w = ((p3.x - p1.x) + (p4.x - p2.x)) / 2 + hr1 + hr2
            //     const h = ((p3.y - p3.y) + (p4.y - p2.y)) / 2 + (hr1 + hr2) * 2
            //     const x = p1.x - hr1 + w / 2
            //     const y = p1.y - hr1 / 2 + h / 2

            //     const textA = [[71 * prp, 105 * prp], [160 * prp, 105 * prp], [163 * prp, 201 * prp], [71 * prp, 203 * prp]]
            //     const textWhen = [[83 * prp, 261 * prp], [264 * prp, 259 * prp], [265 * prp, 346 * prp], [80 * prp, 355 * prp]]
            //     const line = [408 * prp, 346 * prp, 708 * prp, 338 * prp]
            //     const p = [[177 * prp, 135 * prp], [761 * prp, 132 * prp], [755 * prp, 190 * prp], [180 * prp, 194 * prp]]

            //     console.log(x, y, w, h)
            //     this.canvas.ellipse(x, y, w, h, { stroke: 'red', strokeWidth: 1, center: true })
            //     this.canvas.line(x - w / 2 - 10, y, x + w / 2 + 10, y, { stroke: 'red', strokeWidth: 1 })
            //     this.canvas.polygon(textA)
            //     this.canvas.polygon(textWhen)
            //     this.canvas.line(...line)
            //     this.canvas.polygon(p, { fill: 'rgba(255, 0, 0, 0.3)', stroke: 'rgba(255, 0, 0, 1)' })
            //     this.canvas.curveTag(...line, { stroke: 'green', strokeWidth: 1 })
            // })

            // downLoadImg('http://127.0.0.1:8080/test2.jpg').then((res) => {
            //     const height = this.data.width * res.height / res.width
            //     this.setData({ height })
            //     this.canvas.drawImage(res.path, { x: 0, y: 0, width: this.data.width, height })

            //     const correctResults = formatCoorectResults(testData.data, this.data.width / res.width)
            //     // console.log('correctResults: ', correctResults)

            //     const blockList = []
            //     correctResults.forEach((notation, index) => {
            //         const vertice = notation.vertice
            //         blockList.push({
            //             x: notation.x - notation.w / 2,
            //             y: notation.y - notation.h / 2,
            //             w: notation.w,
            //             h: notation.h,
            //             type: ErrorType.categoryShap[notation.item.category],
            //             polygon: [vertice],
            //             rectangle: [notation.x - notation.w / 2, notation.y - notation.h / 2, notation.w, notation.h],
            //             line: [vertice[vertice.length - 1][0], vertice[vertice.length - 1][1], vertice[vertice.length / 2][0], vertice[vertice.length / 2][1]],
            //             ellipse: [notation.x, notation.y, notation.w, notation.h],
            //             options: {
            //                 rotate: notation.angle,
            //                 fill: 'rgba(255, 0, 0, 0.3)',
            //                 stroke: ErrorType.categoryColor[notation.item.category],
            //                 center: true,
            //             },
            //             onClick: () => {
            //                 console.log('???', notation)
            //                 // errorTip3.setState({
            //                 // style: {
            //                 //     display: 'block',
            //                 //     key: 'tab1',
            //                 //     top: notation.y + notation.h / 2,
            //                 //     left: notation.x - notation.w / 2,
            //                 // },
            //                 // notation: {
            //                 //     categoryHumanText: ErrorType.categoryHumanText[notation.item.category],
            //                 //     ...notation.item,
            //                 // }
            //                 // })
            //                 // errorTip3.update()
            //             }
            //         })

            //         vertice.forEach((point) => {
            //         //   console.log('point: ', point)
            //           this.canvas.circle(...point, 1) 
            //         })
            //     })

            //     // 注册click事件
            //     // console.log('blockList: ', blockList)
            //     blockList.forEach((item, index) => {
            //         this.canvas[item.type](...item[item.type], item.options)
            //     })
            //     // const mousedownEvent = (e) => {
            //     //     const x = e.clientX
            //     //     const y = e.clientY
            //     //     console.log(x, y)
            //     //     let havePoint = false
            //     //     for (let i = blockList.length - 1; i >= 0; i--) {
            //     //     if (checkBoundary(x, y, blockList[i])) {
            //     //         blockList[i].onClick()
            //     //         havePoint = true
            //     //     }
            //     //     }
            //     //     console.log('???havePoint', havePoint)
            //     //     if (!havePoint) {
            //     //     errorTip3.setState({
            //     //         style: {
            //     //         display: 'none',
            //     //         },
            //     //     })
            //     //     errorTip3.update()
            //     //     }
            //     // }
            //     // canvas.addEventListener('click', mousedownEvent)
            // })
        },
    }
  })
  