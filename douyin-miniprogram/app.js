App({
  onLaunch() {
    console.log('App Launch')
  },
  globalData: {
    userInfo: null,
    selectedTests: [],
    score: 0,
    ranking: 0,
    subjectGroup: '',
    checkedSubjects: [],
    personalityResults: {}
  }
})