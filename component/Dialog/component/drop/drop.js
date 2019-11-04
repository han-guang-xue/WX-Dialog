Page({

  
  data: {
    LRnumber: 300,
    UDnumber: 370,
  },

  onLoad: function (options) {
    this.windowHeight = wx.getSystemInfoSync().windowHeight
    this.windowWidth = wx.getSystemInfoSync().windowWidth
  },
  // 点击时的初始位置
  touchstart(e) {
    this.startSeat = e.touches[0]
  },
  // 移动时的位置
  touchmove(e) {
    let vm = this
    let endPoint = e.touches[e.touches.length - 1]
    let translateX = endPoint.clientX - vm.startSeat.clientX
    let translateY = endPoint.clientY - vm.startSeat.clientY
    this.startSeat = endPoint
    let buttonTop = this.UDnumber + translateY
    let buttonLeft = this.LRnumber + translateX
    // 判断是移动否超出屏幕
    if ((buttonLeft + 63) >= this.windowWidth) {
      buttonLeft = this.windowWidth - 63
    }
    if (buttonLeft <= 0) {
      buttonLeft = 0
    }
    if (buttonTop <= 0) {
      buttonTop = 0
    }
    if (buttonTop + 63 >= this.windowHeight) {
      buttonTop = this.windowHeight - 63
    }
    this.UDnumber = buttonTop
    this.LRnumber = buttonLeft
    vm.$apply()
  },
  // 松开时的终末位置
  touchend(e) { },


  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})