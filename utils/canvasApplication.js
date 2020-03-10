import { throttle, gridConnectionPoints } from './util.js'
import { isArray } from './lodash.js'

const EImageFillType = {
  STRETCH: 'STRETCH',
  STRETCH_CENTER: 'STRETCH_CENTER',
  REPEAT: 'REPEAT',
  REPEAT_X: 'REPEAT_X',
  REPEAT_Y: 'REPEAT_Y',
  CENTER: 'CENTER',
}

class CanvasApplication {
  constructor(canvas, that) {
    this.ctx = wx.createCanvasContext(canvas.id, that) 
    this.canvas = canvas

    // console.log('--', this.ctx, this.canvas)

    // 网格坐标
    this.interval = 12

    // 默认样式
    this.defaultStyle = {
      stroke: 'blue',
      lineWidth: 0.5, 
    }
  }

  check = () => {
    if (this.ctx === null) {
      return
    }
  }

  print = (api) => {
    const apis = Object.keys(this.ctx)
    if (api) {
      const names = []
      apis.forEach((key) => {
        if (key.toLowerCase().indexOf(api.toLowerCase()) > -1) {
          names.push(key)
        }
      })
      console.log(api, '-- 映射 --', names)
      return names
    } else {
      console.log('apis', apis)
    }
  }

  checkApi = (names) => {
    if (names) {
      const data = []
      names.forEach((name) => {
        data.push(` | ${name} | ${this.print(name)}`)
      })
      console.log(this.ctx, this.canvas)
      console.log(data.join('\n'))
    }
  }

  checkAllApi = () => {
    this.checkApi([
      'save',
      'lineWidth',
      'lineCap',
      'lineJoin',
      'lineDashOffset',
      'font',
      'strokeStyle',
      'fillStyle',
      'rect',
      'arc',
      'beginPath',
      'moveTo',
      'lineTo',
      'closePath',
      'stroke',
      'fill',
      'rotate',
      'translate',
      'scale',
      'restore',
      'drawImage',
      'imageData',
      'getImageData',
      'putImageData',
      'clearRect',
    ])
  }

  drawImage = (img, srcRect = {}, destRect = {}, fillType = EImageFillType.STRETCH, noDraw) =>  {
    this.check()

    if (fillType === EImageFillType.STRETCH_CENTER) {
      console.log('stretch_center')
    } else if (fillType === EImageFillType.CENTER) {
      console.log('center')
    } else if (fillType === EImageFillType.STRETCH) {
      // 分为stretch和repeat两种法方式
      console.log('stretch')
      this.ctx.drawImage(img,
        srcRect.x,
        srcRect.y,
        srcRect.width,
        srcRect.height,
        destRect.x,
        destRect.y,
        destRect.width,
        destRect.height,
      )
    } else {
      // 使用repeat模式
      console.log('repeat')
      // 调用Math.floor方法 round ceil
      let rows = Math.ceil(destRect.width / srcRect.width)
      let colums = Math.ceil(destRect.height / srcRect.height)
      // 下面6个变量在行列双重循环中每次都会更新
      // 表示的是当前要绘制的区域的位置与尺寸
      let left = 0
      let top = 0
      let right = 0
      let bottom = 0
      let width = 0
      let height = 0
      // 计算出目标Rectangle的right和bottom坐标
      let destRight = destRect.x + destRect.width
      let destBottom = destRect.y + destRect.height
      // REPEAT_X 和 REPEAT_Y 是REPEAT的一种特殊形式
      if (fillType === EImageFillType.REPEAT_X) {
        colums = 1
      } else if (fillType === EImageFillType.REPEAT_Y) {
        rows = 1
      }
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < colums; j++) {
          // 如何计算第i行第j列的坐标
          left = destRect.x + j * srcRect.width;
          top = destRect.y + j * srcRect.height;
          width = srcRect.width
          height = srcRect.height

          // 计算出当前要绘制的区域的右下坐标
          right = left + width
          bottom = top + height
          if (right > destRect) {
            width = srcRect.width - (right - destRect)
          }
          if (bottom > destBottom) {
            height = srcRect.heigt - (bottom - destBottom)
          }

          this.ctx.drawImage(img, srcRect.x, srcRect.y, width, height, left, top, width, height)
        }
      }
    }

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  strokeCoord = (originX, originY, width, height) => {
    this.check()
    this.ctx.save()
    // 红色 x 轴
    this.ctx.setStrokeStyle('red')
    this.line(originX, originY, originX + width, originY)
    // 蓝色 y 轴
    this.ctx.setStrokeStyle('blue')
    this.line(originX, originY, originX, originY + height)
    this.ctx.restore()
  }

  strokeGrid = (interval = 10, showCoord) => {
    // console.log('strokeGrid: ', interval)
    this.check()

    this.ctx.save()
    // 从左到右每隔interval个像素画一条垂直线
    for (let i = interval + 0.5; i < this.canvas.width; i += interval) {
      this.line(i, 0, i, this.canvas.height, {}, true)
    }

    // 从上到下画水平线
    for (let i = interval + 0.5; i < this.canvas.height; i += interval) {
      this.line(0, i, this.canvas.width, i, {}, true)
    }
    this.ctx.restore()

    if (showCoord) {
      // 绘制网格背景全局坐标系的原点
      this.fillCircle(0, 0, 5, 'green')
      // 绘制全局坐标系
      this.strokeCoord(0, 0, this.ctx.width, this.ctx.height)
    }
  }

  setStyle = (params) => {
    const options = Object.assign({}, !(params.fill || params.stroke) && this.defaultStyle, params)
    // console.log('options: ', options)
    if (options.lineWidth || options.strokeWidth) {
      this.ctx.setLineWidth(options.strokeWidth || options.lineWidth)
    }
    if (options.fill) {
      this.ctx.setFillStyle(options.fill)
    }
    if (options.stroke) {
      this.ctx.setStrokeStyle(options.stroke)
    }

    return options
  }

  line = (x0, y0, x1, y1, options = {}, noDraw) => {
    this.check()
    this.setStyle(options) 
    this.ctx.beginPath()
    this.ctx.moveTo(x0, y0)
    this.ctx.lineTo(x1, y1)
    this.ctx.stroke()

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  linearPath = (params, options = {}, noDraw) => {
    this.check()
    this.ctx.save()

    const newOptions = this.setStyle(options)

    if (isArray(params) && params.length > 1) {
      this.ctx.beginPath()
      this.ctx.moveTo(...params[0])
      for (let i = 1; i < params.length; i++) {
        this.ctx.lineTo(...params[i])
      }
    }
    
    this.ctx.stroke()
    this.ctx.restore()

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  polygon = (params, options = {}, noDraw) => {
    this.check()
    this.ctx.save()

    const newOptions = this.setStyle(options)

    if (isArray(params) && params.length > 1) {
      this.ctx.beginPath()
      this.ctx.moveTo(...params[0])
      for (let i = 1; i < params.length; i++) {
        this.ctx.lineTo(...params[i])
      }
      this.ctx.lineTo(...params[0])
    }
    
    if (newOptions.fill) {
      this.ctx.fill()
    }
    if (newOptions.stroke) {
      this.ctx.stroke() 
    }
    this.ctx.restore()

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  rectangle = (x, y, width, height, options = {}, noDraw) => {
    this.check()
    this.ctx.save()

    const newOptions = this.setStyle(options)
   
    // const borderWidth = options.lineWidth || 0
    // const width = w + borderWidth * 2
    // const height = h + borderWidth * 2 
    if (newOptions.fill) {
      this.ctx.fillRect(x, y, width, height)
    }
    if (newOptions.stroke) {
      this.ctx.strokeRect(x, y, width, height)
    }
    this.ctx.restore()

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  circle = (x, y, radius, options = {}, noDraw) => {
    this.check()
    this.ctx.save()
    
    this.ctx.beginPath()
    const newOptions = this.setStyle(options)

    const borderWidth = options.lineWidth || 0
    let cp = [x + radius, y + radius]
    if (options.center) {
      cp = [x, y]
    }

    this.ctx.arc(cp[0], cp[1], radius, 0, Math.PI * 2)
    if (newOptions.fill) {
      this.ctx.fill()
    }
    if (newOptions.stroke) {
      this.ctx.stroke()
    }
    this.ctx.restore()

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  ellipse = (x, y, width, height, options = {}, noDraw) => {
    this.check()
    this.ctx.save()
    
    this.ctx.beginPath()
    const newOptions = this.setStyle(options)

    const borderWidth = options.lineWidth || 0
    // const width = w + borderWidth * 2
    // const height = h + borderWidth * 2
    let cp = [x + width / 2, y + height / 2]
    if (options.center) {
      cp = [x, y]
    }

    const p1 = [cp[0] - width / 2, cp[1]]
    const p1_2 = [cp[0] - width / 2, cp[1] - height / 2]
    const p2 = [cp[0], cp[1] - height / 2]
    const p2_3 = [cp[0] + width / 2, cp[1] - height / 2]
    const p3 = [cp[0] + width / 2, cp[1]]
    const p3_4 = [cp[0] + width / 2, cp[1] + height / 2]
    const p4 = [cp[0], cp[1] + height / 2]
    const p4_1 = [cp[0] - width / 2, cp[1] + height / 2]

    this.ctx.moveTo(...p1)
    this.ctx.bezierCurveTo(...p1, ...p1_2, ...p2) 
    this.ctx.bezierCurveTo(...p2, ...p2_3, ...p3)
    this.ctx.bezierCurveTo(...p3, ...p3_4, ...p4)
    this.ctx.bezierCurveTo(...p4, ...p4_1, ...p1)

    if (newOptions.fill) {
      this.ctx.fill()
    }
    if (newOptions.stroke) {
      this.ctx.stroke()
    }
    this.ctx.restore()

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  fan = (x, y, radius, startAngle, endAngle, rotateDirection = false, options = {}, noDraw) => {
    this.check()
    this.ctx.save()

    this.ctx.beginPath()
    const newOptions = this.setStyle(options)
   
    let cp = [x + radius, y + radius]
    if (options.center) {
      cp = [x, y]
    }
 
    if (
      options.startProportion >= 0 && options.startProportion <= 1 &&
      options.endProportion >= 0 && options.endProportion <= 1
    ) {
      // num / total * 2 * Math.PI
      this.ctx.arc(cp[0], cp[1], radius, options.startProportion * 2 * Math.PI, options.endProportion * 2 * Math.PI, rotateDirection)
    } else {
      this.ctx.arc(cp[0], cp[1], radius, startAngle, endAngle, rotateDirection)
    }
    this.ctx.lineTo(cp[0], cp[1])
    this.ctx.closePath()
    if (newOptions.fill) {
      this.ctx.fill()
    }
    if (newOptions.stroke) {
      this.ctx.stroke()
    }
    this.ctx.restore() 

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  // 跨象限问题
  arc = (x, y, width, height, angleX, angleY, rotateDirection = false, options = {}, noDraw) => {
    this.check()
    this.ctx.save()

    let cp = [x + width / 2, y + height / 2]
    if (options.center) {
      cp = [x, y]
    }

    // 椭圆标准方程转化为极坐标方程
    // (a²+b²)+(b²-a²)cos2θ=2a²b²/ρ²
    const leftValX = (Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) + (Math.pow(height / 2, 2) - Math.pow(width / 2, 2)) * Math.cos(2 * angleX)
    const leftValY = (Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) + (Math.pow(height / 2, 2) - Math.pow(width / 2, 2)) * Math.cos(2 * angleY)
    const rightVal = 2 * Math.pow(width / 2, 2) * Math.pow(height / 2, 2)
    const rpX = Math.sqrt(rightVal / leftValX)
    const rpY = Math.sqrt(rightVal / leftValY)
    console.log('----', rpX, rpY)

    const p1x = Math.floor(rpX * Math.cos(angleX))
    const p1y = Math.floor(rpX * Math.sin(angleX))
    const p2x = Math.floor(rpY * Math.cos(angleY))
    const p2y = Math.floor(rpY * Math.sin(angleY))

    console.log('p1: ', angleX, rpX, [p1x, p1y])
    console.log('p2: ', angleX, rpY, [p2x, p2y])

    const p1 = [p1x + cp[0], p1y + cp[1]]
    const p2 = [p2x + cp[0], p2y + cp[1]]
    let p1_2 = []

    if (p1[0] >= p2[0]) {
      p1_2 = [p1[0], p2[1]]
    } else {
      p1_2 = [p2[0], p1[1]]
    }

    console.log('p1_2: ', p1, p1_2, p2)
    
    const newOptions = this.setStyle(options)
    this.ctx.moveTo(cp[0], cp[1])
    this.ctx.lineTo(p1[0], p1[1])
    this.ctx.bezierCurveTo(...p1, ...p1_2, ...p2)
    this.ctx.lineTo(p2[0], p2[1])
    this.ctx.closePath()

    if (newOptions.fill) {
      this.ctx.fill()
    }
    if (newOptions.stroke) {
      this.ctx.stroke()
    }
    this.ctx.restore()

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  curveTag = (x, y, x1, y1, options, noDraw) => {
    this.check()
    this.ctx.save()
    const newOptions = this.setStyle(options)

    console.log('x, y, x1, y1: ', x, y, x1, y1)

    let points = [];
    const interval = 45

    points.push([x, y])
    for (let i = 0; i < (x1 - x) / 7; i++) {
      let pointX = x + (x1 / interval) * i + 10;
      let xdeg = (30 * Math.PI / 180) * i * 20;
      let pointY = y + Math.round(Math.sin(xdeg) * 5);

      points.push([pointX, pointY]);
    }
    points.push([x1, y1])

    this.ctx.beginPath()
    // console.log('points: ', points.length / 3, points)
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 0; i < points.length - 1; i = i + 2) {
      this.ctx.bezierCurveTo(...points[i], ...points[i + 1], ...points[i + 2])
    }

    if (newOptions.stroke) {
      this.ctx.stroke()
    }

    if (!noDraw) {
      this.ctx.draw(true)
    }
  }

  clean = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.draw(true)
  }

  // 有问题
  eraser = (x, y, w, h) => {
    this.ctx.clearRect(x, y, w, h)
    this.ctx.draw(false)
  }

  init = () => {
    this.clean()
    this.rectangle(0, 0, this.canvas.width, this.canvas.height, { fill: '#fff' }, true)
    this.strokeGrid(this.interval)
    this.strokeGrid(Math.floor(this.interval * 5))
    this.ctx.draw()
  }
}

export default CanvasApplication