const { RecommendationEngine } = require('../../utils/recommendation')
const app = getApp()

Page({
  data: {
    currentTab: 'major',
    personalitySummary: '',
    majors: [],
    universities: [],
    score: 0,
    ranking: 0
  },

  onLoad() {
    this.generateResults()
  },

  generateResults() {
    const engine = new RecommendationEngine()

    engine.setScore(
      app.globalData.score,
      app.globalData.ranking,
      app.globalData.subjectGroup,
      app.globalData.checkedSubjects
    )

    engine.setPersonalityResults(app.globalData.personalityResults)

    const personalitySummary = engine.getPersonalitySummary()
    const majors = engine.getRecommendedMajors()
    const universities = engine.getRecommendedUniversities()

    this.setData({
      personalitySummary: personalitySummary.fullDescription,
      majors,
      universities,
      score: app.globalData.score,
      ranking: app.globalData.ranking
    })
  },

  switchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.tab })
  },

  saveResults() {
    const { personalitySummary, majors, universities, score, ranking } = this.data

    let content = '═══════════════════════════════════════════\n'
    content += '         河南高考志愿填报推荐结果\n'
    content += '═══════════════════════════════════════════\n\n'

    content += `【基本信息】\n`
    content += `高考分数：${score} 分\n`
    content += `省排名位次：第 ${ranking} 名\n\n`

    content += `【性格分析】\n`
    content += `${personalitySummary}\n`

    content += `【专业推荐】\n`
    majors.slice(0, 10).forEach((major, i) => {
      content += `${i + 1}. ${major.name}（${major.category}）- 匹配度：${major.matchScore}%\n`
    })
    content += '\n'

    content += `【院校推荐】\n`
    universities.forEach((uni, i) => {
      content += `${i + 1}. ${uni.name}（${uni.level}）${uni.matchLevel}\n`
    })

    content += '\n═══════════════════════════════════════════\n'
    content += `生成时间：${new Date().toLocaleString('zh-CN')}\n`

    tt.setClipboardData({
      data: content,
      success() {
        tt.showToast({ title: '已复制到剪贴板', icon: 'success' })
      }
    })
  },

  shareResults() {
    tt.shareAppMessage({
      title: '河南高考志愿填报推荐',
      path: '/pages/index/index',
      success() {
        tt.showToast({ title: '分享成功', icon: 'success' })
      }
    })
  }
})