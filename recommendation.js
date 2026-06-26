class RecommendationEngine {
    constructor() {
        this.score = 0;
        this.ranking = 0;
        this.subjectGroup = '';
        this.checkedSubjects = [];
        this.personalityResults = {};
    }

    setScore(score, ranking, subjectGroup, checkedSubjects) {
        this.score = parseInt(score);
        this.ranking = parseInt(ranking);
        this.subjectGroup = subjectGroup;
        this.checkedSubjects = checkedSubjects || [];
    }

    setPersonalityResults(results) {
        this.personalityResults = results;
    }

    getRecommendedMajors() {
        const recommendedMajors = [];
        const personalityProfile = this.analyzePersonality();
        
        for (const [category, data] of Object.entries(majorCategories)) {
            const matchResult = this.calculateCategoryMatch(personalityProfile, data);
            
            if (matchResult.score > 0.2) {
                for (const major of data.majors) {
                    recommendedMajors.push({
                        ...major,
                        category,
                        matchScore: Math.round(matchResult.score * 100),
                        reasons: matchResult.reasons,
                        categoryDescription: data.description
                    });
                }
            }
        }

        recommendedMajors.sort((a, b) => b.matchScore - a.matchScore);
        return recommendedMajors.slice(0, 15);
    }

    analyzePersonality() {
        const profile = { mbti: null, holland: null, disc: null, big5: null, clifton: null, traits: [] };

        if (this.personalityResults.mbti) {
            profile.mbti = this.personalityResults.mbti.type;
            profile.traits.push(...this.getMBTITraits(this.personalityResults.mbti));
        }
        if (this.personalityResults.holland) {
            profile.holland = this.personalityResults.holland.type;
            profile.traits.push(...this.getHollandTraits(this.personalityResults.holland));
        }
        if (this.personalityResults.disc) {
            profile.disc = this.personalityResults.disc.type;
            profile.traits.push(...this.getDISCTraits(this.personalityResults.disc));
        }
        if (this.personalityResults.big5) {
            profile.big5 = this.personalityResults.big5;
            profile.traits.push(...this.getBig5Traits(this.personalityResults.big5));
        }
        if (this.personalityResults.clifton) {
            profile.clifton = this.personalityResults.clifton;
            profile.traits.push(...this.getCliftonTraits(this.personalityResults.clifton));
        }

        return profile;
    }

    getMBTITraits(result) {
        const traits = [];
        const { type } = result;
        if (type.includes('I')) traits.push('内向型', '独立思考');
        if (type.includes('E')) traits.push('外向型', '社交能力强');
        if (type.includes('N')) traits.push('直觉型', '富有想象力');
        if (type.includes('S')) traits.push('感觉型', '注重细节');
        if (type.includes('T')) traits.push('思维型', '逻辑分析');
        if (type.includes('F')) traits.push('情感型', '关心他人');
        if (type.includes('J')) traits.push('判断型', '有条理');
        if (type.includes('P')) traits.push('感知型', '灵活应变');
        return traits;
    }

    getHollandTraits(result) {
        const traits = [];
        const { type } = result;
        if (type.includes('R')) traits.push('现实型', '动手能力强');
        if (type.includes('I')) traits.push('研究型', '喜欢探索');
        if (type.includes('A')) traits.push('艺术型', '有创造力');
        if (type.includes('S')) traits.push('社会型', '乐于助人');
        if (type.includes('E')) traits.push('企业型', '有领导力');
        if (type.includes('C')) traits.push('常规型', '有条理');
        return traits;
    }

    getDISCTraits(result) {
        const traits = [];
        const { type } = result;
        if (type.includes('D')) traits.push('支配型', '果断');
        if (type.includes('I')) traits.push('影响型', '善于沟通');
        if (type.includes('S')) traits.push('稳健型', '可靠');
        if (type.includes('C')) traits.push('谨慎型', '注重细节');
        return traits;
    }

    getBig5Traits(result) {
        const traits = [];
        result.details.forEach(d => { if (d.level === '高') traits.push(d.name + '高'); });
        return traits;
    }

    getCliftonTraits(result) {
        const traits = [];
        result.topThree.forEach(s => { traits.push(s.name + '优势'); });
        return traits;
    }

    calculateCategoryMatch(profile, categoryData) {
        let score = 0;
        const reasons = [];
        
        if (profile.mbti && categoryData.types) {
            const mbtiMatch = this.calculateMBTIMatch(profile.mbti, categoryData.types);
            if (mbtiMatch > 0) {
                score += mbtiMatch * 0.4;
                reasons.push(`您的MBTI类型(${profile.mbti})与该专业类型要求(${categoryData.types.join('/')})高度匹配`);
            }
        }
        if (profile.holland && categoryData.holland) {
            const hollandMatch = this.calculateHollandMatch(profile.holland, categoryData.holland);
            if (hollandMatch > 0) {
                score += hollandMatch * 0.35;
                reasons.push(`您的霍兰德职业兴趣(${profile.holland})与该专业方向(${categoryData.holland.join('/')})匹配度高`);
            }
        }
        if (profile.disc && categoryData.disc) {
            const discMatch = this.calculateDISCMatch(profile.disc, categoryData.disc);
            if (discMatch > 0) {
                score += discMatch * 0.25;
                reasons.push(`您的DISC性格(${profile.disc})适合该专业的工作方式`);
            }
        }
        
        return { score: Math.min(score, 1), reasons };
    }

    calculateMBTIMatch(userType, compatibleTypes) {
        let maxMatch = 0;
        for (const compatible of compatibleTypes) {
            let matchCount = 0;
            for (let i = 0; i < Math.min(userType.length, compatible.length); i++) {
                if (userType[i] === compatible[i]) matchCount++;
            }
            maxMatch = Math.max(maxMatch, matchCount / 4);
        }
        return maxMatch;
    }

    calculateHollandMatch(userType, compatibleTypes) {
        let matchCount = 0;
        for (const char of userType) { if (compatibleTypes.includes(char)) matchCount++; }
        return matchCount / userType.length;
    }

    calculateDISCMatch(userType, compatibleTypes) {
        let maxMatch = 0;
        for (const compatible of compatibleTypes) {
            let matchCount = 0;
            for (const char of userType) { if (compatible.includes(char)) matchCount++; }
            maxMatch = Math.max(maxMatch, matchCount / 2);
        }
        return maxMatch;
    }

    getScore(uni) {
        return uni.latestScore || uni.scores['2025'] || uni.scores['2024'] || uni.scores[2025] || uni.scores[2024] || 0;
    }

    getRanking(uni) {
        return uni.latestRanking || uni.ranking['2025'] || uni.ranking['2024'] || uni.ranking[2025] || uni.ranking[2024] || 0;
    }

    getMajorScore(major) {
        return major.latest_score || major.scores['2025'] || major.scores['2024'] || major.scores[2025] || major.scores[2024] || 0;
    }

    getMajorRanking(major) {
        return major.latest_ranking || major.ranking['2025'] || major.ranking['2024'] || major.ranking[2025] || major.ranking[2024] || 0;
    }

    getYearScores(uni) {
        return ['2025', '2024', '2023'].map(y => ({
            year: y,
            score: uni.scores[y] || uni.scores[parseInt(y)] || null,
            ranking: uni.ranking[y] || uni.ranking[parseInt(y)] || null
        }));
    }

    getRecommendedUniversities() {
        const recommendedUnis = [];
        const userSubjects = this.getUserSubjects();
        
        for (const uni of universities) {
            const latestScore = this.getScore(uni);
            const latestRanking = this.getRanking(uni);
            if (!latestScore) continue;
            
            const scoreDiff = this.score - latestScore;
            let matchLevel = '';
            
            if (scoreDiff >= 30) {
                matchLevel = '保底';
            } else if (scoreDiff >= 0) {
                matchLevel = '稳妥';
            } else if (scoreDiff >= -20) {
                matchLevel = '冲刺';
            } else {
                continue;
            }
            
            const majorScores = [];
            if (uni.majors) {
                for (const major of uni.majors) {
                    const majorScore = this.getMajorScore(major);
                    const majorRanking = this.getMajorRanking(major);
                    if (majorScore > 0) {
                        const canApply = this.score >= majorScore;
                        const subjectReq = major.batch || '不限';
                        const subjectMatch = this.checkSubjectMatch(subjectReq, userSubjects);
                        majorScores.push({
                            name: major.name,
                            score: majorScore,
                            ranking: majorRanking,
                            subjectReq: subjectReq,
                            canApply,
                            subjectMatch
                        });
                    }
                }
            }
            
            recommendedUnis.push({
                name: uni.name,
                level: uni.level,
                city: uni.city,
                type: uni.type,
                matchLevel,
                scoreDiff: Math.abs(scoreDiff),
                latestScore,
                latestRanking,
                scores: uni.scores,
                ranking: uni.ranking,
                majorScores,
                canApply: true
            });
        }

        recommendedUnis.sort((a, b) => {
            const levelOrder = { '保底': 0, '稳妥': 1, '冲刺': 2 };
            return levelOrder[a.matchLevel] - levelOrder[b.matchLevel] || a.scoreDiff - b.scoreDiff;
        });

        return recommendedUnis;
    }

    getUserSubjects() {
        const group = subjectGroups.find(g => g.id === this.subjectGroup);
        const required = group ? [group.required] : [];
        return [...required, ...(this.checkedSubjects || [])];
    }

    checkSubjectMatch(req, userSubjects) {
        if (!req || req === '不限' || req === '无要求') return true;
        if (req.includes('+')) {
            const required = req.split('+');
            return required.every(r => userSubjects.some(s => s.includes(r)));
        }
        if (req.includes('优先')) {
            return true;
        }
        return userSubjects.some(s => s.includes(req.replace('物理', '物理').replace('化学', '化学').replace('生物', '生物')));
    }

    getPersonalitySummary() {
        const results = this.personalityResults;
        let summary = { testsCompleted: Object.keys(results), results: {}, fullDescription: '' };

        for (const testId of Object.keys(results)) {
            summary.results[testId] = { name: personalityTests[testId].name, result: results[testId] };
        }

        summary.fullDescription = this.generateFullDescription();
        return summary;
    }

    generateFullDescription() {
        const results = this.personalityResults;
        let desc = '';
        
        if (results.mbti) {
            const r = results.mbti;
            desc += `【MBTI性格类型】${r.type}\n`;
            desc += `${typeDescriptions[r.type] || '未识别类型'}\n`;
            desc += `性格维度分析：\n`;
            desc += `• 精力来源：${r.details.EI.value === 'E' ? '外向' : '内向'}\n`;
            desc += `• 信息获取：${r.details.SN.value === 'S' ? '感觉' : '直觉'}\n`;
            desc += `• 决策方式：${r.details.TF.value === 'T' ? '思维' : '情感'}\n`;
            desc += `• 生活态度：${r.details.JP.value === 'J' ? '判断' : '感知'}\n\n`;
        }
        if (results.holland) {
            const r = results.holland;
            desc += `【霍兰德职业兴趣代码】${r.type}\n`;
            r.details.forEach(d => { desc += `• ${d.name}(${d.code})：${d.score}分\n`; });
            desc += '\n';
        }
        if (results.disc) {
            const r = results.disc;
            desc += `【DISC性格类型】${r.type}\n`;
            desc += `主要类型：${typeDescriptions[r.primary]}\n`;
            desc += `次要类型：${typeDescriptions[r.secondary]}\n\n`;
        }
        if (results.big5) {
            const r = results.big5;
            desc += `【大五人格】\n`;
            r.details.forEach(d => { desc += `• ${d.name}：${d.level}（得分：${d.score}）\n`; });
            desc += '\n';
        }
        if (results.clifton) {
            const r = results.clifton;
            desc += `【盖洛普优势】Top 3：`;
            r.topThree.forEach((s, i) => { desc += `${s.name}(${s.score}分)`; if (i < r.topThree.length - 1) desc += '、'; });
            desc += '\n';
        }
        
        return desc;
    }
}

const recommendationEngine = new RecommendationEngine();
