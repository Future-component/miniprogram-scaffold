import '../utils/wxPromise';

function request(url, method, data, success, fail) {
  showLoading('加载中')
  wx.pro.request({
    url: url,
    method: method,
    data: data,
    header: {
      'Content-Type': 'application/json'
    },
  }).then((result) => {
    console.log(result);
    console.log(data);
    if (result.data && result.data.code == 0) {
      success(result.data);
    } else {
      showError(result.data.msg);
      fail(result.data.msg);
    }
  }).catch((err) => {
    fail(err.msg);
  }).finally(() => {
    hideLoading();
  });
}



function showLoading(title) {
  wx.showLoading({
    title: title,
    mask: true
  });
}

function hideLoading() {
  wx.hideLoading();
}

function showError(message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 1000
  })
}

function Get(url, data, success, fail) {
  return request(url, "GET", data, success, fail);
}

function Post(url, data, success, fail) {
  return request(url, "POST", data, success, fail);
}

function uploadFile(url, data, success, fail) {
  showLoading('加载中')
  wx.pro.uploadFile({
    url: url,
    filePath: data.file,
    name: 'file',
    formData: {
      'transcript': data.transcript,
    },
  }).then(result => {
    const data = JSON.parse(result.data);
    if (data && data.code == 0) {
      success(data);
      console.log(data)
    } else {
      console.log(result)
      showError("上传失败");
      fail("上传失败");
    }
  }).catch((err) => {
    fail(err.msg);
  }).finally(() => {
    hideLoading();
  });
}

exports.Get = Get;
exports.Post = Post;
exports.showToast = showError;
exports.uploadFile = uploadFile;