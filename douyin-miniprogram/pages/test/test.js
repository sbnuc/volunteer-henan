const { personalityTests } = require('../../utils/personality')
const app = getApp()

Page({
  data: {
    phase: 'select',
    selectedTests: [],
    currentTestIndex: 0,
    currentQuestion: 0,
    totalQuestions: 0,
    currentQuestionData: null,
    selectedOption: -1,
    answers: {},
    score: '',
    ranking: '',
    subjectGroup: '',
    checkedSubjects: [],
    progress: 0,
    isLastQuestion: false
  },

  onLoad() {
    this.setData({
      selectedTests: [],
      answers: {},
      score: '',
      ranking: '',
      subjectGroup: '',
      checkedSubjects: []
    })
  },

  toggleTest(e) {
    const test = e.currentTarget.dataset.test
    let { selectedTests } = this.data
    const index = selectedTests.indexOf(test)
    if (index === -1) {
      selectedTests.push(test)
    } else {
      selectedTests.splice(index, 1)
    }
    this.setData({ selectedTests })
  },

  startTesting() {
    if (this.data.selectedTests.length < 2) {
      tt.showToast({ title: '请至少选择2个测试', icon: 'none' })
      return
    }

    let totalQuestions = 0
    this.data.selectedTests.forEach(testId => {
      totalQuestions += personalityTests[testId].questionCount
    })

    this.setData({
      phase: 'testing',
      currentTestIndex: 0,
      currentQuestion: 0,
      totalQuestions,
      selectedOption: -1
    })

    this.loadCurrentQuestion()
  },

  loadCurrentQuestion() {
    const testId = this.data.selectedTests[this.data.currentTestIndex]
    const test = personalityTests[testId]
    const questionIndex = this.getGlobalQuestionIndex()
    const question = test.questions[questionIndex]

    this.setData({
      currentQuestionData: question,
      selectedOption: -1,
      progress: Math.round((this.data.currentQuestion / this.data.totalQuestions) * 100),
      isLastQuestion: this.data.currentQuestion === this.data.totalQuestions - 1
    })

    const existingAnswer = this.data.answers[testId]?.[questionIndex]
    if (existingAnswer !== undefined) {
      this.setData({ selectedOption: existingAnswer })
    }
  },

  getGlobalQuestionIndex() {
    let index = 0
    for (let i = 0; i < this.data.currentTestIndex; i++) {
      const testId = this.data.selectedTests[i]
      index += personalityTests[testId].questionCount
    }
    return this.data.currentQuestion - index
  },

  selectOption(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ selectedOption: index })
  },

  prevQuestion() {
    if (this.data.currentQuestion > 0) {
      this.saveCurrentAnswer()
      this.setData({ currentQuestion: this.data.currentQuestion - 1 })

      let testIndex = 0
      let questionCount = 0
      for (let i = 0; i < this.data.selectedTests.length; i++) {
        const testId = this.data.selectedTests[i]
        questionCount += personalityTests[testId].questionCount
        if (this.data.currentQuestion < questionCount) {
          testIndex = i
          break
        }
      }
      this.setData({ currentTestIndex: testIndex })
      this.loadCurrentQuestion()
    }
  },

  nextQuestion() {
    if (this.data.selectedOption === -1) {
      tt.showToast({ title: '请先选择一个选项', icon: 'none' })
      return
    }

    this.saveCurrentAnswer()

    if (this.data.isLastQuestion) {
      this.finishTesting()
      return
    }

    this.setData({ currentQuestion: this.data.currentQuestion + 1 })

    let testIndex = 0
    let questionCount = 0
    for (let i = 0; i < this.data.selectedTests.length; i++) {
      const testId = this.data.selectedTests[i]
      questionCount += personalityTests[testId].questionCount
      if (this.data.currentQuestion < questionCount) {
        testIndex = i
        break
      }
    }
    this.setData({ currentTestIndex: testIndex })
    this.loadCurrentQuestion()
  },

  saveCurrentAnswer() {
    if (this.data.selectedOption === -1) return

    const testId = this.data.selectedTests[this.data.currentTestIndex]
    const questionIndex = this.getGlobalQuestionIndex()
    const { answers } = this.data

    if (!answers[testId]) answers[testId] = {}
    answers[testId][questionIndex] = this.data.selectedOption
    this.setData({ answers })
  },

  finishTesting() {
    const results = {}
    this.data.selectedTests.forEach(testId => {
      results[testId] = this.calculateTestResult(testId)
    })

    app.globalData.personalityResults = results
    this.setData({ phase: 'score' })
  },

  calculateTestResult(testId) {
    const test = personalityTests[testId]
    const answers = this.data.answers[testId] || {}

    if (testId === 'mbti') {
      return this.calculateMBTI(answers, test)
    } else if (testId === 'holland') {
      return this.calculateHolland(answers, test)
    } else if (testId === 'disc') {
      return this.calculateDISC(answers, test)
    }
  },

  calculateMBTI(answers, test) {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

    test.questions.forEach((q, i) => {
      if (answers[i] !== undefined) {
        const dim = q.dim
        if (dim === 'EI') {
          counts[answers[i] === 0 ? 'I' : 'E']++
        } else if (dim === 'SN') {
          counts[answers[i] === 0 ? 'N' : 'S']++
        } else if (dim === 'TF') {
          counts[answers[i] === 0 ? 'T' : 'F']++
        } else if (dim === 'JP') {
          counts[answers[i] === 0 ? 'J' : 'P']++
        }
      }
    })

    const type = (counts.E >= counts.I ? 'E' : 'I') +
                 (counts.S >= counts.N ? 'S' : 'N') +
                 (counts.T >= counts.F ? 'T' : 'F') +
                 (counts.J >= counts.P ? 'J' : 'P')

    return {
      type,
      details: {
        EI: { value: counts.E >= counts.I ? 'E' : 'I', score: Math.max(counts.E, counts.I) },
        SN: { value: counts.S >= counts.N ? 'S' : 'N', score: Math.max(counts.S, counts.N) },
        TF: { value: counts.T >= counts.F ? 'T' : 'F', score: Math.max(counts.T, counts.F) },
        JP: { value: counts.J >= counts.P ? 'J' : 'P', score: Math.max(counts.J, counts.P) }
      }
    }
  },

  calculateHolland(answers, test) {
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

    test.questions.forEach((q, i) => {
      if (answers[i] !== undefined && answers[i] === 0) {
        const dim = q.dim
        if (counts[dim] !== undefined) counts[dim]++
      }
    })

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const type = sorted.slice(0, 3).map(([code]) => code).join('')
    const details = Object.entries(counts).map(([code, score]) => ({
      code,
      name: test.dimensions.find(d => d.code === code)?.name || code,
      score
    }))

    return { type, details }
  },

  calculateDISC(answers, test) {
    const counts = { D: 0, I: 0, S: 0, C: 0 }

    test.questions.forEach((q, i) => {
      if (answers[i] !== undefined && answers[i] === 0) {
        const dim = q.dim
        if (counts[dim] !== undefined) counts[dim]++
      }
    })

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const type = sorted.map(([code]) => code).join('')

    return {
      type,
      primary: sorted[0][0],
      secondary: sorted[1][0]
    }
  },

  onScoreInput(e) {
    this.setData({ score: e.detail.value })
  },

  onRankingInput(e) {
    this.setData({ ranking: e.detail.value })
  },

  selectSubjectGroup(e) {
    this.setData({ subjectGroup: e.currentTarget.dataset.group })
  },

  toggleSubject(e) {
    const subject = e.currentTarget.dataset.subject
    let { checkedSubjects } = this.data
    const index = checkedSubjects.indexOf(subject)
    if (index === -1) {
      checkedSubjects.push(subject)
    } else {
      checkedSubjects.splice(index, 1)
    }
    this.setData({ checkedSubjects })
  },

  generateResult() {
    if (!this.data.score || !this.data.ranking || !this.data.subjectGroup) {
      tt.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    app.globalData.score = this.data.score
    app.globalData.ranking = this.data.ranking
    app.globalData.subjectGroup = this.data.subjectGroup
    app.globalData.checkedSubjects = this.data.checkedSubjects

    tt.navigateTo({
      url: '/pages/result/result'
    })
  }
})