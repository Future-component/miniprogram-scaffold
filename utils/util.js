const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatAge(dateString) {
  var today = new Date();
  var birthday = new Date(dateString);
  var age = today.getFullYear() - birthday.getFullYear();
  var m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}

/**
 * 防止多次点击
 */
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

function checkPhone(phone) {
  if (!(/^1\d{10}$/.test(phone))) {
    return true;
  }
}

/**
 * 判断对象是否为空
 */
function isEmpty(obj) {
  switch (typeof obj) {
    case 'undefined':
      return true
    case 'string':
      return obj.length == 0
    case 'object':
      if (obj === null) {
        return true
      }
      for (var key in obj) {
        if (obj.hasOwnProperty(key))
          return false
      }
      return true
    default:
      return false
  }
}

module.exports = {
  formatTime: formatTime,
  formatAge: formatAge,
  throttle: throttle,
  checkPhone: checkPhone,
  isEmpty: isEmpty
}