const app = getApp()

Page({
  data: {},

  onLoad() {
    console.log('Index page loaded')
  },

  startTest() {
    tt.navigateTo({
      url: '/pages/test/test'
    })
  }
})