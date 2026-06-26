class PersonalityTest {
    constructor() {
        this.currentTest = null;
        this.currentQuestion = 0;
        this.answers = {};
        this.results = {};
        this.selectedTests = [];
        this.testOrder = ['mbti', 'holland', 'disc', 'big5', 'clifton'];
    }

    // 获取所有可用测试
    getAvailableTests() {
        return this.testOrder.map(id => ({
            id,
            name: personalityTests[id].name,
            description: personalityTests[id].description,
            questionCount: personalityTests[id].questions.length
        }));
    }

    // 设置用户选择的测试
    setSelectedTests(testIds) {
        if (testIds.length < 2) {
            throw new Error('请至少选择两个测试');
        }
        this.selectedTests = testIds;
        this.currentTest = testIds[0];
        this.currentQuestion = 0;
    }

    getTestInfo(testId) {
        return personalityTests[testId];
    }

    getCurrentQuestion() {
        if (!this.currentTest) return null;
        const test = personalityTests[this.currentTest];
        if (this.currentQuestion < test.questions.length) {
            return test.questions[this.currentQuestion];
        }
        return null;
    }

    selectAnswer(answerIndex) {
        if (!this.answers[this.currentTest]) {
            this.answers[this.currentTest] = [];
        }
        this.answers[this.currentTest][this.currentQuestion] = answerIndex;
    }

    nextQuestion() {
        const test = personalityTests[this.currentTest];
        this.currentQuestion++;
        
        if (this.currentQuestion >= test.questions.length) {
            this.calculateResult();
            return this.nextTest();
        }
        return false;
    }

    nextTest() {
        const currentIndex = this.selectedTests.indexOf(this.currentTest);
        if (currentIndex < this.selectedTests.length - 1) {
            this.currentTest = this.selectedTests[currentIndex + 1];
            this.currentQuestion = 0;
            return true;
        }
        return false;
    }

    calculateResult() {
        const test = personalityTests[this.currentTest];
        const answers = this.answers[this.currentTest] || [];
        this.results[this.currentTest] = test.scoring(answers);
    }

    getProgress() {
        const test = personalityTests[this.currentTest];
        if (!test) return { current: 0, total: 0, percentage: 0 };
        
        const totalQuestions = test.questions.length;
        return {
            current: this.currentQuestion,
            total: totalQuestions,
            percentage: (this.currentQuestion / totalQuestions) * 100
        };
    }

    getAllResults() {
        return this.results;
    }

    getPersonalitySummary() {
        let summary = {
            testsCompleted: Object.keys(this.results),
            results: {},
            description: ''
        };

        for (const testId of Object.keys(this.results)) {
            const result = this.results[testId];
            const testInfo = personalityTests[testId];
            
            summary.results[testId] = {
                name: testInfo.name,
                result: result
            };
        }

        summary.description = this.generateDescription();
        return summary;
    }

    generateDescription() {
        let desc = '';
        
        if (this.results.mbti) {
            const r = this.results.mbti;
            desc += `【MBTI类型】${r.type} - ${typeDescriptions[r.type] || '未识别类型'}\n`;
            desc += `您的性格特点：精力来源偏向${r.details.EI.value}（${r.details.EI.value === 'E' ? '外向' : '内向'}），`;
            desc += `信息获取偏向${r.details.SN.value}（${r.details.SN.value === 'S' ? '感觉' : '直觉'}），`;
            desc += `决策方式偏向${r.details.TF.value}（${r.details.TF.value === 'T' ? '思维' : '情感'}），`;
            desc += `生活态度偏向${r.details.JP.value}（${r.details.JP.value === 'J' ? '判断' : '感知'}）。\n\n`;
        }
        
        if (this.results.holland) {
            const r = this.results.holland;
            desc += `【霍兰德代码】${r.type}\n`;
            desc += `您的职业兴趣类型：`;
            r.details.forEach((d, i) => {
                desc += `${d.name}(${d.code}:${d.score}分)`;
                if (i < r.details.length - 1) desc += '、';
            });
            desc += '\n\n';
        }
        
        if (this.results.disc) {
            const r = this.results.disc;
            desc += `【DISC类型】${r.type}\n`;
            desc += `您的主要类型为${typeDescriptions[r.primary]}，次要类型为${typeDescriptions[r.secondary]}。\n`;
            desc += `各维度得分：D(支配):${r.scores.D}、I(影响):${r.scores.I}、S(稳健):${r.scores.S}、C(谨慎):${r.scores.C}\n\n`;
        }
        
        if (this.results.big5) {
            const r = this.results.big5;
            desc += `【大五人格】\n`;
            r.details.forEach(d => {
                desc += `${d.name}：${d.level}（得分：${d.score}）\n`;
            });
            desc += '\n';
        }
        
        if (this.results.clifton) {
            const r = this.results.clifton;
            desc += `【盖洛普优势】Top 3优势：`;
            r.topThree.forEach((s, i) => {
                desc += `${s.name}(${s.score}分)`;
                if (i < r.topThree.length - 1) desc += '、';
            });
            desc += '\n';
        }
        
        return desc;
    }

    getCurrentTestName() {
        if (!this.currentTest) return '';
        return personalityTests[this.currentTest]?.name || '';
    }

    getCurrentTestIndex() {
        if (!this.currentTest) return 0;
        return this.selectedTests.indexOf(this.currentTest) + 1;
    }

    getSelectedTestCount() {
        return this.selectedTests.length;
    }

    // 检查是否已完成所有选择的测试
    isAllCompleted() {
        return this.selectedTests.every(testId => this.results[testId]);
    }
}

const personalityTest = new PersonalityTest();
