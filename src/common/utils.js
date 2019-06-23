export default {
  /**
   * 导航到指定页面
   * @param pageName
   * @param defaultUrl
   * @param paramter
   */
  goToPage: function (pageName, defaultUrl, paramter) {
    let theParamterArray = []
    for (let key in paramter) {
      theParamterArray.push(key + '=' + paramter[key])
    }
    location.href = defaultUrl + '?' + theParamterArray.join('&')
  },
  // 获得url中的参数,放在对象中,然后返回这个对象
  getUrlParams: function () {
    let args = {}
    let query = location.search.substring(1) // 获取查询串
    let pairs = query.split('&')// 在逗号处断开
    for (let i = 0; i < pairs.length; i++) {
      let pos = pairs[i].indexOf('=')// 查找name=value
      if (pos === -1) continue// 如果没有找到就跳过
      let argname = pairs[i].substring(0, pos).toLowerCase()// 提取name
      let value = pairs[i].substring(pos + 1)// 提取value
      args[argname] = decodeURIComponent(value)// 存为属性
    }
    return args
  },
  IOSConfig: function () {
    let userAgent = navigator.userAgent
    if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('Mac') > -1) {
      console.log('on iphone/mac')
      window.addEventListener('popstate', function (e) {
        // alert("后退");
        console.log('后退')
        self.location.reload()
      }, false)
      let state = {
        title: '',
        url: '#'
      }
      window.history.replaceState(state, '', '#')
    }
  },
  /**
   * 节流函数。
   */
  throttle: function (action, delay) {
    let timeout = null
    let lastRun = 0
    return function () {
      if (timeout) return
      let elapsed = Date.now() - lastRun
      let context = this
      let args = arguments
      let runCallback = function () {
        lastRun = Date.now()
        timeout = false
        action.apply(context, args)
      }
      if (elapsed >= delay) {
        runCallback()
      } else {
        timeout = setTimeout(runCallback, delay)
      }
    }
  },
  getClientHeight: function () {
    let clientHeight = 0
    // if (document.body.clientHeight && document.documentElement.clientHeight) {
    //   clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    // } else {
    //   clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    // }
    if (document.documentElement.clientHeight) {
      clientHeight = document.documentElement.clientHeight
    }
    console.log('可视区域高度:', clientHeight)
    return clientHeight
  },
  add0 (m) {
    return m < 10 ? '0' + m : m
  },
  /**
   * 检测html的fontsize是否已设置, 如果已设置则进行下一步 ,否则递归
   * @param cb 回调函数
   * @returns {boolean}
   */
  hasSetRem (cb) {
    let theHTML = document.getElementsByTagName('html')[0]
    let theFS = theHTML.style.fontSize
    let time1 // 定时器
    if (theFS) {
      clearTimeout(time1) // 清除定时器
      cb()
      return false
    } else {
      time1 = setTimeout(() => {
        this.hasSetRem(cb) // 递归扫描
      }, 300)
    }
  }
}
