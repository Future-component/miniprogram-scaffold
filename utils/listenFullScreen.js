/// callBack( `0 | 1 | -1` )
function startListen(callBack) {
  /**
   * 0  竖屏
   * 1  横屏 home 健在右边
   * -1 横屏 home 健在左边
  */
  let lastState = 0
  let lastTime = Date.now()

  wx.startAccelerometer()
  wx.onAccelerometerChange((res) => {
    const now = Date.now()

    if (now - lastTime < 500) {
      return
    }

    lastTime = now
    let nowState

    // 57.3 = 180 / Math.PI
    const Roll = Math.atan2(-res.x, Math.sqrt(res.y * res.y + res.z * res.z)) * 57.3
    const Pitch = Math.atan2(res.y, res.z) * 57.3



    if (Math.abs(Roll) > 50) {
      if (((Pitch > -180) && (Pitch < -60)) || (Pitch > 130) ) {
        nowState = Roll > 0 ? 1 : -1
      } else {
        nowState = lastState
      }
    } else if ((Roll > 0 && Roll < 30) || (Roll < 0 && Roll > -30)) {
      let absPitch = Math.abs(Pitch)
      if ((absPitch > 140) || (absPitch < 40)) {
        nowState = lastState
      } else if (Pitch < 40) {
        nowState = 0
      } else {
        nowState = lastState
      }
    } else {
      nowState = lastState
    }

    if (nowState != lastState) {
      lastState = nowState

      callBack(nowState)
    }
  })
}

function stopListen() {
  wx.stopAccelerometer()
}

module.exports = {
  startListen: startListen,
  stopListen: stopListen
}