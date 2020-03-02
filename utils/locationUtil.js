import config from '../config'
const QQMapWX = require('../plugin/qqmap-wx-jssdk.min');

// var qqmapsdk = new QQMapWX({
//   key: config.mapKey // 必填
// });


// 检查定位权限
export function checkPermission() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userLocation"]) {
          resolve()
        } else {
          reject()
        }
      },
      fail(e) {
        console.log("check permission fail:", e)
        reject()
      }
    })
  })
}


// 申请定位权限
export function requestPermission() {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: 'scope.userLocation',
      success(res) {
        resolve()
      },
      fail(e) {
        console.log("request permission fail:", e)
        reject()
      }
    })
  })
}

// 获取当前位置 res.latitude, res.longitude
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        resolve(res)
      },
      fail: function(e) {
        console.log("get user location fail:", e)
        reject()
      }
    })
  })
}

// 获取当前城市 返回城市名
export function getUserCity(latitute, longitude) {
  return new Promise((resolve, reject) => {
    // qqmapsdk.reverseGeocoder({
    //   location: {
    //     latitude: latitute,
    //     longitude: longitude
    //   },
    //   success: function(res) {
    //     console.log(res)
    //     resolve(res.result.address_component.province)
    //   },
    //   fail: function(e) {
    //     console.log("get user current city fail:", e)
    //     reject()
    //   }
    // })
  })
}

// 计算距离
export function calculateDistance(locations) {
  return new Promise((resolve, reject) => {
    // qqmapsdk.calculateDistance({
    //   to: locations,
    //   success: function(res) {
    //     if (res.status == 0 && res.result !== undefined) {
    //       let distances = res.result.elements.map((e) => {
    //         let km = e.distance / 1000
    //         if (km >= 1) {
    //           return km.toFixed(1)
    //         } else {
    //           return km
    //         }
    //       })
    //       resolve(distances)
    //     } else {
    //       reject()
    //     }
    //   },
    //   fail: function(e) {
    //     console.log("calculateDistance fail:", e)
    //     reject()
    //   }
    // })
  })
}