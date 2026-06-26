let currentStep = 1;
let selectedTests = [];

const sections = {
    select: document.getElementById('select-section'),
    test: document.getElementById('test-section'),
    score: document.getElementById('score-section'),
    result: document.getElementById('result-section')
};

const elements = {
    testSelection: document.getElementById('test-selection'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    stepNav: document.querySelectorAll('.step'),
    recTabs: document.querySelectorAll('.rec-tab'),
    majorResults: document.getElementById('major-results'),
    universityResults: document.getElementById('university-results'),
    personalitySummary: document.getElementById('personality-summary'),
    dimensionInfo: document.getElementById('dimension-info')
};

function init() {
    setupEventListeners();
    showSection('select');
    renderTestSelection();
}

function setupEventListeners() {
    if (elements.recTabs) {
        elements.recTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                elements.recTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.rec === 'major') {
                    elements.majorResults.style.display = 'grid';
                    elements.universityResults.style.display = 'none';
                } else {
                    elements.majorResults.style.display = 'none';
                    elements.universityResults.style.display = 'grid';
                }
            });
        });
    }
    const saveBtn = document.getElementById('save-results');
    if (saveBtn) saveBtn.addEventListener('click', saveResults);
}

function renderTestSelection() {
    const tests = personalityTest.getAvailableTests();
    elements.testSelection.innerHTML = `
        <div class="test-selection-info">
            <p>请从以下5种性格测试中选择<strong>至少2个</strong>进行测试（也可全部测试）</p>
            <p class="selected-count">已选择: <span id="selected-count">0</span>个</p>
        </div>
        <div class="test-cards">
            ${tests.map(test => `
                <div class="test-card" data-test-id="${test.id}">
                    <h4>${test.name}</h4>
                    <p>${test.description}</p>
                    <p class="question-count">${test.questionCount}道题目</p>
                    <div class="test-dimensions">${getTestDimensions(test.id)}</div>
                </div>
            `).join('')}
        </div>
        <div class="selection-actions">
            <button id="confirm-selection" class="btn-primary" disabled>确认选择并开始测试</button>
        </div>
    `;
    document.querySelectorAll('.test-card').forEach(card => {
        card.addEventListener('click', () => toggleTestSelection(card));
    });
    document.getElementById('confirm-selection').addEventListener('click', confirmTestSelection);
}

function getTestDimensions(testId) {
    const test = personalityTests[testId];
    if (!test.dimensions) return '';
    return test.dimensions.map(d => `<span class="dimension-tag">${d.name}</span>`).join('');
}

function toggleTestSelection(card) {
    const testId = card.dataset.testId;
    const index = selectedTests.indexOf(testId);
    if (index === -1) {
        selectedTests.push(testId);
        card.classList.add('selected');
    } else {
        selectedTests.splice(index, 1);
        card.classList.remove('selected');
    }
    document.getElementById('selected-count').textContent = selectedTests.length;
    document.getElementById('confirm-selection').disabled = selectedTests.length < 2;
}

function confirmTestSelection() {
    if (selectedTests.length < 2) { alert('请至少选择2个测试'); return; }
    personalityTest.setSelectedTests(selectedTests);
    currentStep = 2;
    updateStepNav();
    showSection('test');
    loadQuestion();
}

function loadQuestion() {
    const question = personalityTest.getCurrentQuestion();
    const testId = personalityTest.currentTest;
    const test = personalityTests[testId];
    
    if (question) {
        const testIndex = personalityTest.getCurrentTestIndex();
        const testCount = personalityTest.getSelectedTestCount();
        
        elements.questionText.innerHTML = `
            <div class="question-header">
                <span class="test-badge">${personalityTest.getCurrentTestName()}</span>
                <span class="question-progress">测试 ${testIndex}/${testCount}</span>
            </div>
            <div class="question-text">${question.q}</div>
        `;
        
        if (question.dim && elements.dimensionInfo) {
            const dimInfo = test.dimensions?.find(d => d.code === question.dim);
            if (dimInfo) {
                elements.dimensionInfo.innerHTML = `
                    <div class="dimension-hint">
                        <span class="dim-label">测试维度：</span>
                        <span class="dim-name">${dimInfo.name}</span>
                        <span class="dim-desc">${dimInfo.desc}</span>
                    </div>
                `;
            }
        }
        
        elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span class="option-text">${option}</span>`;
            btn.addEventListener('click', () => selectOption(index, btn));
            elements.optionsContainer.appendChild(btn);
        });
        
        updateProgress();
        
        const existingAnswer = personalityTest.answers[testId]?.[personalityTest.currentQuestion];
        if (existingAnswer !== undefined) {
            const optionBtns = elements.optionsContainer.querySelectorAll('.option-btn');
            if (optionBtns[existingAnswer]) optionBtns[existingAnswer].classList.add('selected');
        }
    }
}

function selectOption(index, btn) {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    personalityTest.selectAnswer(index);
}

function updateProgress() {
    const progress = personalityTest.getProgress();
    elements.progressBar.style.setProperty('--progress', `${progress.percentage}%`);
    elements.progressText.textContent = `${progress.current}/${progress.total}`;
}

function handleNextQuestion() {
    const currentAnswer = personalityTest.answers[personalityTest.currentTest]?.[personalityTest.currentQuestion];
    if (currentAnswer === undefined) { alert('请先选择一个选项'); return; }
    
    const hasMore = personalityTest.nextQuestion();
    if (hasMore) {
        loadQuestion();
    } else {
        if (personalityTest.isAllCompleted()) {
            currentStep = 3;
            updateStepNav();
            showSection('score');
        } else {
            loadQuestion();
        }
    }
}

function handlePrevQuestion() {
    if (personalityTest.currentQuestion > 0) {
        personalityTest.currentQuestion--;
        loadQuestion();
    }
}

function showSection(sectionName) {
    Object.values(sections).forEach(section => {
        if (section) section.classList.remove('active');
    });
    if (sections[sectionName]) sections[sectionName].classList.add('active');
}

function updateStepNav() {
    elements.stepNav.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
        step.classList.toggle('completed', index + 1 < currentStep);
    });
}

function handleScoreSubmit(e) {
    e.preventDefault();
    const score = document.getElementById('score').value;
    const ranking = document.getElementById('ranking').value;
    const subjectGroup = document.getElementById('subject-group').value;
    
    const checkedSubjects = [];
    document.querySelectorAll('input[name="subject"]:checked').forEach(cb => {
        checkedSubjects.push(cb.value);
    });
    
    if (!score || !ranking || !subjectGroup) { alert('请填写完整信息'); return; }
    
    recommendationEngine.setScore(score, ranking, subjectGroup, checkedSubjects);
    recommendationEngine.setPersonalityResults(personalityTest.getAllResults());
    
    generateRecommendations();
    currentStep = 4;
    updateStepNav();
    showSection('result');
}

function generateRecommendations() {
    const personalitySummary = recommendationEngine.getPersonalitySummary();
    elements.personalitySummary.innerHTML = `
        <h3>您的性格分析报告</h3>
        <div class="summary-content"><pre>${personalitySummary.fullDescription}</pre></div>
    `;
    
    // 专业推荐
    const majors = recommendationEngine.getRecommendedMajors();
    elements.majorResults.innerHTML = `
        <div class="results-header"><h4>基于您的性格特点，推荐以下专业方向：</h4></div>
        ${majors.map(major => `
            <div class="result-card">
                <div class="card-header">
                    <h4>${major.name}</h4>
                    <span class="category-badge">${major.category}</span>
                </div>
                <p class="major-desc">${major.desc}</p>
                <div class="tags-container">${major.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                <div class="match-score">匹配度：${major.matchScore}%</div>
                <div class="match-reasons">
                    <h5>推荐理由：</h5>
                    <ul>${major.reasons.map(reason => `<li>${reason}</li>`).join('')}</ul>
                </div>
                <div class="category-info"><p><strong>专业类别说明：</strong>${major.categoryDescription}</p></div>
            </div>
        `).join('')}
    `;
    
    // 院校推荐（含专业分数线和位次）
    const universities = recommendationEngine.getRecommendedUniversities();
    elements.universityResults.innerHTML = `
        <div class="results-header"><h4>根据您的分数（${recommendationEngine.score}分）和位次（第${recommendationEngine.ranking}名），推荐以下院校：</h4></div>
        ${universities.map(uni => `
            <div class="result-card university-card">
                <div class="card-header">
                    <h4>${uni.name}</h4>
                    <span class="level-badge">${uni.level}</span>
                </div>
                <div class="uni-info">
                    <p><strong>类型：</strong>${uni.type} | <strong>城市：</strong>${uni.city}</p>
                    <p><strong>最新最低分：</strong>${uni.latestScore}分 | <strong>最低位次：</strong>第${uni.latestRanking}名</p>
                </div>
                <div class="scores-history">
                    <h5>历年录取分数与位次：</h5>
                    <div class="score-table">
                        <div class="table-header">
                            <span class="col-year">年份</span>
                            <span class="col-score">最低分</span>
                            <span class="col-ranking">最低位次</span>
                        </div>
                        ${['2025', '2024', '2023'].map(year => `
                            <div class="table-row">
                                <span class="col-year">${year}</span>
                                <span class="col-score">${uni.scores[year] || '-'}</span>
                                <span class="col-ranking">第${uni.ranking[year] || '-'}名</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${uni.majorScores.length > 0 ? `
                <div class="major-scores-section">
                    <h5>各专业录取分数线（最新年份）：</h5>
                    <div class="major-scores-table">
                        <div class="table-header">
                            <span class="col-major">专业名称</span>
                            <span class="col-score">录取分数</span>
                            <span class="col-ranking">录取位次</span>
                            <span class="col-req">选科要求</span>
                            <span class="col-status">您的情况</span>
                        </div>
                        ${uni.majorScores.map(major => `
                            <div class="table-row">
                                <span class="col-major">${major.name}</span>
                                <span class="col-score">${major.score}分</span>
                                <span class="col-ranking">第${major.ranking}名</span>
                                <span class="col-req">${major.subjectReq}</span>
                                <span class="col-status ${major.canApply && major.subjectMatch ? 'can-apply' : major.canApply ? 'subject-mismatch' : 'cannot-apply'}">
                                    ${major.canApply && major.subjectMatch ? '✓ 可报考' : major.canApply ? '⚠ 选科不符' : '✗ 分数不足'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                <div class="match-level ${uni.matchLevel}"><span>${uni.matchLevel}</span></div>
            </div>
        `).join('')}
    `;
}

function saveResults() {
    const results = {
        personality: personalityTest.getAllResults(),
        score: recommendationEngine.score,
        ranking: recommendationEngine.ranking,
        subjectGroup: recommendationEngine.subjectGroup,
        checkedSubjects: recommendationEngine.checkedSubjects,
        majors: recommendationEngine.getRecommendedMajors(),
        universities: recommendationEngine.getRecommendedUniversities()
    };

    let content = '═══════════════════════════════════════════\n';
    content += '         河南高考志愿填报推荐结果\n';
    content += '═══════════════════════════════════════════\n\n';

    content += `【基本信息】\n`;
    content += `高考分数：${results.score} 分\n`;
    content += `省排名位次：第 ${results.ranking} 名\n`;
    content += `首选科目组：${results.subjectGroup === 'phys' ? '物理组' : '历史组'}\n`;
    if (results.checkedSubjects && results.checkedSubjects.length > 0) {
        content += `再选科目：${results.checkedSubjects.join('、')}\n`;
    }
    content += '\n';

    content += `【性格测试结果】\n`;
    if (results.personality) {
        for (const [testName, testResult] of Object.entries(results.personality)) {
            if (testResult && testResult.type) {
                content += `• ${testName}：${testResult.type}`;
                if (testResult.description) content += ` — ${testResult.description}`;
                content += '\n';
            }
        }
    }
    content += '\n';

    content += `【专业推荐】\n`;
    if (results.majors && results.majors.length > 0) {
        results.majors.slice(0, 10).forEach((major, i) => {
            content += `${i + 1}. ${major.name}`;
            if (major.category) content += `（${major.category}）`;
            if (major.matchScore) content += ` - 匹配度：${Math.round(major.matchScore * 100)}%`;
            content += '\n';
        });
    }
    content += '\n';

    content += `【院校推荐】\n`;
    if (results.universities && results.universities.length > 0) {
        results.universities.forEach((uni, i) => {
            content += `${i + 1}. ${uni.name}`;
            if (uni.level) content += `（${uni.level}）`;
            if (uni.type) content += ` ${uni.type}`;
            content += '\n';
            if (uni.minScore) content += `   最低分：${uni.minScore} | 位次：${uni.minRanking || '-'}\n`;
        });
    }

    content += '\n═══════════════════════════════════════════\n';
    content += `生成时间：${new Date().toLocaleString('zh-CN')}\n`;
    content += '═══════════════════════════════════════════\n';

    const dataBlob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `志愿填报推荐结果_${new Date().toLocaleDateString()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

window.handleNextQuestion = handleNextQuestion;
window.handlePrevQuestion = handlePrevQuestion;
window.handleScoreSubmit = handleScoreSubmit;

document.addEventListener('DOMContentLoaded', init);
