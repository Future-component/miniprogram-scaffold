import { isArray } from './lodash'

export const random = (min, max) => Math.floor(Math.random() * (max - min) + min)

export const getRandomPointAry = () => {
  const count = random(2, 10)
  return Array(count).fill(0).map(() => [random(0, 500), random(0, 300)])
}

export const getDefaultOptions = (type, options, { autoHeight, lineHeight }) => {
  const defaultOptions = {
    circle: () => ([autoHeight / 2 + lineHeight, autoHeight / 2 + lineHeight, autoHeight, options]),
    ellipse: () => ([autoHeight * 1.5 / 2 + lineHeight, autoHeight / 2 + lineHeight, autoHeight * 1.5, autoHeight, options]),
    linearPath: () => ([getRandomPointAry()]),
    polygon: () => ([getRandomPointAry()]),
    curve: () => ([getRandomPointAry()]),
    arc: () => (
      // x,  y,   w,   h,  start,stop,     closed
      // [100, 100, 200, 200, -Math.PI * 2, -Math.PI / 2, true, options],
      [random(50, 500), random(50, 500), random(100, 200), random(100, 200), -Math.PI * (Math.random() * 2), Math.PI / (Math.random() * 2), random(0, 2) ? true : false, options]
    ),
  }
  if (defaultOptions[type]) {
    return defaultOptions[type]()
  }
  return [lineHeight, lineHeight, autoHeight, autoHeight, options]
}

export const getMainOptions = (index, type, options, { autoHeight, sortCount, lineHeight }) => {
  const autoWidth = autoHeight
  const col = Math.floor(index % sortCount)
  const row = Math.floor(index / sortCount)
  const mainOptions = {
    circle: () => {
      const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
      newOptions[0] = (autoWidth + lineHeight) * col + newOptions[2] / 2 + lineHeight
      newOptions[1] = (autoHeight + lineHeight) * row + newOptions[2] / 2 + lineHeight
      return newOptions
    },
    ellipse: () => {
      const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
      newOptions[0] = (autoWidth + lineHeight) * col + newOptions[2] / 2 + lineHeight
      newOptions[1] = (autoHeight + lineHeight) * row + newOptions[3] / 2 + lineHeight
      return newOptions
    },
    linearPath: () => {
      const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
      newOptions[0][0] = [(autoWidth + lineHeight) * col + lineHeight, (autoHeight + lineHeight) * row + lineHeight]
      return newOptions
    },
    polygon: () => {
      const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
      newOptions[0][0] = [(autoWidth + lineHeight) * col + lineHeight, (autoHeight + lineHeight) * row + lineHeight]
      return newOptions
    },
    curve: () => options || getDefaultOptions(type, options, { autoHeight, lineHeight }),
    arc: () => options || getDefaultOptions(type, options, { autoHeight, lineHeight })
  }
  if (mainOptions[type]) {
    return mainOptions[type]()
  }
  
  const newOptions = isArray(options) ? options.slice(0) : getDefaultOptions(type, options, { autoHeight, lineHeight })
  newOptions[0] = (autoWidth + lineHeight) * col + lineHeight
  newOptions[1] = (autoHeight + lineHeight) * row + lineHeight
  return newOptions 
}

export const formatOptions = (index, type, options, params) => {
  if (!params.autoSort) return isArray(options) ? options : getDefaultOptions(type, options, params)
  return getMainOptions(index, type, options, params)
}

/**
  * 计算从x1y1到x2y2的直线，与水平线形成的夹角
  * 计算规则为顺时针从左侧0°到与该直线形成的夹角
  * @param {Object} x1
  * @param {Object} y1
  * @param {Object} x2
  * @param {Object} y2
  */
export const getAngle = (x1, y1, x2, y2) => {
  var x = x1 - x2,
      y = y1 - y2;
  if (!x && !y) {
      return 0;
  }
  var angle = Math.floor((180 + Math.atan2(-y, -x) * 180 / Math.PI + 360) % 360);
  return angle;
}


export const coordinateToEllipseParameter = (data, scale) => {
  let x = 0
  let y = 0
  let w = 0
  let h = 0
  let angle = 0
  if (data.length < 4) {
    new Error('参数不正确')
    return { x, y, w, h, angle }
  }

  let left = { x: null }
  let top = { y: null }
  let right = { x: null }
  let bottom = { y: null }

  left = data[data.length - 1]
  top = data[0]

  data.forEach((item, index) => {
    const point = {
      x: item.x * scale,
      y: item.y * scale
    }
    // if (!left.x || point.x < left.x) {
    if (index === data.length - 1) {
      left = point
    }
    // if (!top.y || point.y < top.y) {
    if (index === 0) {
      top = point
    }
    // if (!right.x || point.x > right.x) {
    if (index === data.length / 2 -1) {
      right = point
    }
    // if (!bottom.y || point.y > bottom.y) {
    if (index === data.length / 2) {
      bottom = point
    }
  })
  const center = {
    x: (right.x + left.x) / 2,
    y: (bottom.y + top.y) / 2,
  }
  const w1 = Math.sqrt(Math.pow(top.x - right.x, 2) + Math.pow(top.y - right.y, 2))
  const w2 = Math.sqrt(Math.pow(bottom.x - left.x, 2) + Math.pow(bottom.y - left.y, 2))
  const h1 = Math.sqrt(Math.pow(top.x - left.x, 2) + Math.pow(top.y - left.y, 2))
  const h2 = Math.sqrt(Math.pow(bottom.x - right.x, 2) + Math.pow(bottom.y - right.y, 2))
  w = (w1 + w2) / 2 + (h1 + h2) / 4
  h = (h1 + h2) / 2 + (h1 + h2) / 6
  const point1 = {
    x: (top.x + left.x) / 2,
    y: (top.y + left.y) / 2
  }
  const point2 = {
    x: (bottom.x + right.x) / 2,
    y: (bottom.y + right.y) / 2,
  }
  angle = (getAngle(point1.x, point1.y, center.x, center.y) - 180 + getAngle(point2.x, point2.y, center.x, center.y)) / 2

  return { center, x: Math.floor(center.x), y: Math.floor(center.y), w: Math.floor(w), h: Math.floor(h), angle }
}

export const formatCoorectResults = (data, scale) => {
  const notations = []
  if (data && data.length) {
    data.forEach((item, index) => {
      const vertices = item.vertices.map((subItem) => {
        return subItem.map((subItem) => ([subItem.x * scale, subItem.y * scale]))
      })
      item.vertices.map((subItem, subIndex) => {
        const params = coordinateToEllipseParameter(subItem, scale)
        notations.push({
          ...params,
          point: [],
          vertice: vertices[subIndex],
          item,
        })
      })
    })
  }

  return notations
}

export const findFourPoint = (arr, type) => {
  var rightPointer = arr.length - 1
  if (rightPointer < 1) {
    return 0
  }
  var leftPointer = 0
  var left = arr[0][0]
  var right = 0
  var top = arr[0][1]
  var bottom = 0
  
  while (leftPointer < rightPointer) {
    console.log(leftPointer)
    const pointL = arr[leftPointer]

    console.log(1, pointL, left, right, bottom, top)
    // const pointR = arr[rightPointer]
    if (pointL[0] < left) left = pointL[0]
    if (pointL[0] > right) right = pointL[0]
    if (pointL[1] > bottom) bottom = pointL[1]
    if (pointL[1] < top) top = pointL[1]

    console.log(2, pointL, left, right, bottom, top)
    leftPointer++
  }
  console.log(left, right, top, bottom)
  // 'ellipse', 'rectangle', 'circle'
  if (type === 'rectangle') {
    return [
      left,
      top,
      right - left,
      bottom - top
    ]
  } else if (type === 'circle') {
    return [
      (right - left) / 2 + left,
      (bottom - top) / 2 + top,
      Math.max(right - left, bottom - top)
    ]
  }

  return [
    (right - left) / 2 + left,
    (bottom - top) / 2 + top,
    right - left,
    bottom - top
  ]
}