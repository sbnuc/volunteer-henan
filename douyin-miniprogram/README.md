# 河南高考志愿填报 - 抖音小程序版

基于性格测试的高考志愿智能推荐系统。

## 功能特性

- **性格测试**：支持MBTI、霍兰德、DISC三大测试
- **专业推荐**：基于性格匹配最适合的专业方向
- **院校推荐**：根据分数智能推荐院校（冲刺/稳妥/保底）

## 目录结构

```
douyin-miniprogram/
├── app.js                 # 小程序入口
├── app.json               # 全局配置
├── app.ttss               # 全局样式
├── pages/
│   ├── index/             # 首页
│   ├── test/              # 性格测试页
│   └── result/            # 推荐结果页
└── utils/
    ├── personality.js     # 性格测试数据
    ├── majors.js          # 专业分类数据
    ├── universities.js    # 院校数据
    └── recommendation.js  # 推荐引擎
```

## 开发指南

1. 下载并安装 [抖音开发者工具](https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/guide/introduction/getting-started)
2. 导入项目目录
3. 在 `app.json` 中配置 AppID
4. 编译运行

## 数据说明

- 院校数据为示例数据，实际使用需替换为真实数据
- 专业分类基于性格测试结果进行匹配

## 注意事项

- 需要在抖音开放平台注册小程序账号
- 发布前需完成小程序备案