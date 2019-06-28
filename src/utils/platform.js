// 浏览器信息
const {userAgent} = navigator;
// 分辨率 宽高
const {width, height} = window.screen;

// 是否是windowsPhone
export const deviceIsWindowsPhone = userAgent.indexOf('Windows Phone') !== -1;

// 是否是安卓
export const deviceIsAndroid = userAgent.indexOf('Android') !== -1 && !deviceIsWindowsPhone;

// iphone 其余都当做安卓处理
export const deviceIsIos = /iP(ad|hone|od)/.test(userAgent) && !deviceIsWindowsPhone;

// 是否是 'ihponeX' 'ihponeXR' 'ihponeXS' 'ihponeXS MAX'
export const isIphoneX = deviceIsIos
  && ((width === 375 && height === 812)
    || (width === 414 && height === 896));

export const getPlatform = (params) => {
  if (isIphoneX) {
    return params.iosX;
  }
  if (deviceIsIos) {
    return params.ios;
  }
  return params.android;
};

// 区别安卓 苹果 用于某些样式的特定化
export const platform = getPlatform({
  ios: 'ios',
  iosX: 'ios-x',
});
