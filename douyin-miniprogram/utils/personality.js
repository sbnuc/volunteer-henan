const personalityTests = {
  mbti: {
    name: 'MBTI性格测试',
    description: '了解你的性格类型和适合的专业方向',
    questionCount: 24,
    dimensions: [
      { code: 'EI', name: '精力来源', desc: '你是如何获取能量的？' },
      { code: 'SN', name: '信息获取', desc: '你如何获取信息？' },
      { code: 'TF', name: '决策方式', desc: '你如何做决定？' },
      { code: 'JP', name: '生活态度', desc: '你如何应对外部世界？' }
    ],
    questions: [
      { q: '你更喜欢', options: ['独处思考', '与人交流'], dim: 'EI' },
      { q: '面对新事物，你更倾向于', options: ['先了解原理', '先动手尝试'], dim: 'SN' },
      { q: '做决定时，你更看重', options: ['逻辑分析', '他人感受'], dim: 'TF' },
      { q: '你的生活方式更偏向', options: ['有计划有条理', '灵活随机应变'], dim: 'JP' },
      { q: '在团队中，你通常', options: ['主动发言', '倾听他人'], dim: 'EI' },
      { q: '学习新知识时，你更喜欢', options: ['理论框架', '实际案例'], dim: 'SN' },
      { q: '当朋友遇到困难时，你倾向于', options: ['分析问题', '情感支持'], dim: 'TF' },
      { q: '你的书桌通常', options: ['整洁有序', '随意摆放'], dim: 'JP' },
      { q: '周末你更想', options: ['参加聚会', '在家休息'], dim: 'EI' },
      { q: '阅读时你更喜欢', options: ['抽象概念', '具体描述'], dim: 'SN' },
      { q: '评价一件事时，你更看重', options: ['公平公正', '人情世故'], dim: 'TF' },
      { q: '旅行前你会', options: ['详细规划', '随遇而安'], dim: 'JP' },
      { q: '长时间社交后你会', options: ['精力充沛', '需要独处'], dim: 'EI' },
      { q: '你更相信', options: ['直觉灵感', '经验事实'], dim: 'SN' },
      { q: '批评别人时你会', options: ['直接指出', '委婉表达'], dim: 'TF' },
      { q: '面对截止日期，你通常', options: ['提前完成', '最后一刻'], dim: 'JP' },
      { q: '你更享受', options: ['头脑风暴', '深入研究'], dim: 'EI' },
      { q: '你更关注', options: ['未来可能', '当下现实'], dim: 'SN' },
      { q: '争论中你更在意', options: ['谁对谁错', '关系和谐'], dim: 'TF' },
      { q: '你更喜欢', options: ['按部就班', '打破常规'], dim: 'JP' },
      { q: '新环境中你通常', options: ['主动介绍自己', '等别人来找你'], dim: 'EI' },
      { q: '解决问题时你倾向于', options: ['创新方法', '传统方法'], dim: 'SN' },
      { q: '你认为好的领导应该', options: ['高效决策', '关心下属'], dim: 'TF' },
      { q: '你的工作习惯是', options: ['一次做完', '分段完成'], dim: 'JP' }
    ]
  },
  holland: {
    name: '霍兰德职业兴趣',
    description: '发现你的职业兴趣类型',
    questionCount: 30,
    dimensions: [
      { code: 'R', name: '现实型', desc: '喜欢动手操作' },
      { code: 'I', name: '研究型', desc: '喜欢探索研究' },
      { code: 'A', name: '艺术型', desc: '喜欢创意表达' },
      { code: 'S', name: '社会型', desc: '喜欢帮助他人' },
      { code: 'E', name: '企业型', desc: '喜欢领导管理' },
      { code: 'C', name: '常规型', desc: '喜欢规范秩序' }
    ],
    questions: [
      { q: '你更喜欢', options: ['修理机器', '帮助他人'], dim: 'R' },
      { q: '你对以下哪个更感兴趣', options: ['科学实验', '组织活动'], dim: 'I' },
      { q: '你更擅长', options: ['绘画写作', '数据分析'], dim: 'A' },
      { q: '在团队中你更愿意', options: ['协调关系', '制定计划'], dim: 'S' },
      { q: '你更享受', options: ['独立工作', '团队协作'], dim: 'E' },
      { q: '面对复杂问题，你倾向于', options: ['动手尝试', '查阅资料'], dim: 'C' },
      { q: '你更喜欢', options: ['户外活动', '室内研究'], dim: 'R' },
      { q: '你更看重', options: ['创新想法', '实际成果'], dim: 'I' },
      { q: '你更享受', options: ['艺术创作', '逻辑推理'], dim: 'A' },
      { q: '你更愿意', options: ['教书育人', '商业谈判'], dim: 'S' },
      { q: '你更喜欢', options: ['领导项目', '执行任务'], dim: 'E' },
      { q: '你更擅长', options: ['记住细节', '把握全局'], dim: 'C' },
      { q: '你更喜欢', options: ['机械装置', '人际交往'], dim: 'R' },
      { q: '你更感兴趣', options: ['理论研究', '市场分析'], dim: 'I' },
      { q: '你更享受', options: ['音乐舞蹈', '策略游戏'], dim: 'A' },
      { q: '你更愿意', options: ['志愿服务', '销售推广'], dim: 'S' },
      { q: '你更喜欢', options: ['影响他人', '服务他人'], dim: 'E' },
      { q: '你更擅长', options: ['整理归档', '创意设计'], dim: 'C' },
      { q: '你更喜欢', options: ['操作工具', '分析数据'], dim: 'R' },
      { q: '你更感兴趣', options: ['探索未知', '管理团队'], dim: 'I' },
      { q: '你更享受', options: ['写作表达', '技术开发'], dim: 'A' },
      { q: '你更愿意', options: ['心理咨询', '项目管理'], dim: 'S' },
      { q: '你更喜欢', options: ['创业冒险', '稳定工作'], dim: 'E' },
      { q: '你更擅长', options: ['遵循流程', '解决问题'], dim: 'C' },
      { q: '你更喜欢', options: ['动手制作', '思考理论'], dim: 'R' },
      { q: '你更感兴趣', options: ['科学研究', '商业运营'], dim: 'I' },
      { q: '你更享受', options: ['艺术表演', '技术研发'], dim: 'A' },
      { q: '你更愿意', options: ['教育工作', '市场营销'], dim: 'S' },
      { q: '你更喜欢', options: ['团队领导', '独立创作'], dim: 'E' },
      { q: '你更擅长', options: ['数据处理', '活动策划'], dim: 'C' }
    ]
  },
  disc: {
    name: 'DISC性格测试',
    description: '了解你的行为风格',
    questionCount: 20,
    dimensions: [
      { code: 'D', name: '支配型', desc: '结果导向、果断' },
      { code: 'I', name: '影响型', desc: '热情乐观、善交际' },
      { code: 'S', name: '稳健型', desc: '耐心可靠、重和谐' },
      { code: 'C', name: '谨慎型', desc: '严谨准确、重标准' }
    ],
    questions: [
      { q: '面对目标，你更倾向于', options: ['快速行动', '充分准备'], dim: 'D' },
      { q: '在社交场合，你通常', options: ['主动活跃', '安静观察'], dim: 'I' },
      { q: '面对变化，你的反应是', options: ['积极适应', '谨慎观望'], dim: 'S' },
      { q: '做决策时，你更看重', options: ['效率结果', '数据准确'], dim: 'C' },
      { q: '在团队中，你更像', options: ['领导者', '协调者'], dim: 'D' },
      { q: '你更享受', options: ['公开演讲', '深入交流'], dim: 'I' },
      { q: '面对冲突，你倾向于', options: ['直接解决', '寻求妥协'], dim: 'S' },
      { q: '你的工作方式是', options: ['追求完美', '追求效率'], dim: 'C' },
      { q: '你更喜欢', options: ['挑战困难', '保持稳定'], dim: 'D' },
      { q: '你更擅长', options: ['激励他人', '服务他人'], dim: 'I' },
      { q: '面对压力，你倾向于', options: ['寻求支持', '独立承受'], dim: 'S' },
      { q: '你更看重', options: ['创新突破', '规范流程'], dim: 'C' },
      { q: '你的沟通风格是', options: ['直接有力', '温和友善'], dim: 'D' },
      { q: '你更享受', options: ['团队合作', '独立工作'], dim: 'I' },
      { q: '面对不确定性，你倾向于', options: ['保持耐心', '寻找规律'], dim: 'S' },
      { q: '你更擅长', options: ['宏观规划', '细节执行'], dim: 'C' },
      { q: '你更喜欢', options: ['掌控局面', '融入集体'], dim: 'D' },
      { q: '你更享受', options: ['社交活动', '安静环境'], dim: 'I' },
      { q: '你更看重', options: ['人际关系', '工作成果'], dim: 'S' },
      { q: '你更擅长', options: ['风险评估', '机会把握'], dim: 'C' }
    ]
  }
}

const typeDescriptions = {
  'INTJ': '独立思考的战略家',
  'INTP': '好奇的逻辑学家',
  'ENTJ': '果断的指挥官',
  'ENTP': '善于辩论的辩论家',
  'INFJ': '安静而神秘的理想主义者',
  'INFP': '诗意的调解者',
  'ENFJ': '富有魅力的主人公',
  'ENFP': '热情的竞选者',
  'ISTJ': '实际且可靠的检查员',
  'ISFJ': '温暖且体贴的守卫者',
  'ESTJ': '出色的管理者',
  'ESFJ': '热心的照顾者',
  'ISTP': '大胆而实际的实验者',
  'ISFP': '灵活而有魅力的探险家',
  'ESTP': '聪明且精力充沛的创业者',
  'ESFP': '自发的表演者'
}

module.exports = {
  personalityTests,
  typeDescriptions
}