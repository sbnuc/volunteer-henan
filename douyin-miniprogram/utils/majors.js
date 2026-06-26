const majorCategories = {
  '计算机与信息技术': {
    description: '培养具备计算机科学与技术基本理论和技能的高级专门人才',
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    holland: ['I', 'C'],
    disc: ['DC', 'CD'],
    majors: [
      { name: '计算机科学与技术', desc: '研究计算机系统的设计、开发和应用', tags: ['编程', '算法', '系统'] },
      { name: '软件工程', desc: '专注于软件开发过程和方法', tags: ['开发', '项目', '测试'] },
      { name: '人工智能', desc: '研究智能系统的设计和实现', tags: ['AI', '机器学习', '深度学习'] },
      { name: '数据科学', desc: '从数据中提取知识和洞察', tags: ['大数据', '分析', '统计'] },
      { name: '信息安全', desc: '保护信息系统和数据安全', tags: ['安全', '加密', '防护'] }
    ]
  },
  '工程与技术': {
    description: '培养具备工程技术能力的专业人才',
    types: ['ISTJ', 'ISTP', 'ESTJ', 'ESTP'],
    holland: ['R', 'I'],
    disc: ['DC', 'SC'],
    majors: [
      { name: '机械工程', desc: '研究机械系统的设计和制造', tags: ['设计', '制造', '自动化'] },
      { name: '电气工程', desc: '研究电气系统和电子技术', tags: ['电力', '电子', '控制'] },
      { name: '土木工程', desc: '研究建筑工程和基础设施', tags: ['建筑', '结构', '施工'] },
      { name: '电子信息工程', desc: '研究电子信息系统', tags: ['通信', '信号', '电路'] },
      { name: '自动化', desc: '研究自动控制系统', tags: ['控制', '机器人', '智能'] }
    ]
  },
  '经济与管理': {
    description: '培养具备经济管理知识的专业人才',
    types: ['ENTJ', 'ESTJ', 'ENTP', 'ESTP'],
    holland: ['E', 'C'],
    disc: ['DC', 'DI'],
    majors: [
      { name: '金融学', desc: '研究货币、银行和投资', tags: ['金融', '投资', '风险'] },
      { name: '会计学', desc: '研究财务信息的记录和分析', tags: ['财务', '审计', '税务'] },
      { name: '工商管理', desc: '培养企业管理人才', tags: ['管理', '战略', '运营'] },
      { name: '市场营销', desc: '研究市场分析和营销策略', tags: ['营销', '品牌', '推广'] },
      { name: '国际经济与贸易', desc: '研究国际经济关系', tags: ['贸易', '国际', '商务'] }
    ]
  },
  '医学与健康': {
    description: '培养医疗卫生领域的专业人才',
    types: ['ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'],
    holland: ['S', 'I'],
    disc: ['SC', 'CS'],
    majors: [
      { name: '临床医学', desc: '培养临床医疗人才', tags: ['诊断', '治疗', '手术'] },
      { name: '药学', desc: '研究药物的开发和使用', tags: ['药物', '研发', '制药'] },
      { name: '护理学', desc: '培养护理专业人才', tags: ['护理', '照顾', '医疗'] },
      { name: '口腔医学', desc: '研究口腔疾病治疗', tags: ['牙科', '口腔', '修复'] },
      { name: '预防医学', desc: '研究疾病预防和控制', tags: ['防疫', '公共卫生', '流行病'] }
    ]
  },
  '教育与人文': {
    description: '培养教育和人文社科领域的专业人才',
    types: ['ENFJ', 'INFJ', 'ENFP', 'INFP'],
    holland: ['S', 'A'],
    disc: ['IS', 'SI'],
    majors: [
      { name: '教育学', desc: '研究教育理论和实践', tags: ['教学', '课程', '教育'] },
      { name: '心理学', desc: '研究人类心理和行为', tags: ['心理', '咨询', '治疗'] },
      { name: '汉语言文学', desc: '研究中国语言文学', tags: ['文学', '写作', '文化'] },
      { name: '英语', desc: '研究英语语言和文学', tags: ['语言', '翻译', '文化'] },
      { name: '历史学', desc: '研究人类历史发展', tags: ['历史', '研究', '文化'] }
    ]
  },
  '艺术与设计': {
    description: '培养艺术创作和设计人才',
    types: ['ENFP', 'INFP', 'ENTP', 'INTP'],
    holland: ['A', 'I'],
    disc: ['ID', 'DI'],
    majors: [
      { name: '视觉传达设计', desc: '研究视觉信息传递', tags: ['设计', '创意', '视觉'] },
      { name: '环境设计', desc: '研究空间环境设计', tags: ['空间', '装饰', '规划'] },
      { name: '产品设计', desc: '研究产品造型和功能', tags: ['产品', '造型', '创新'] },
      { name: '动画', desc: '研究动画制作技术', tags: ['动画', '影视', '特效'] },
      { name: '数字媒体艺术', desc: '研究数字媒体内容创作', tags: ['新媒体', '交互', '数字'] }
    ]
  }
}

module.exports = {
  majorCategories
}