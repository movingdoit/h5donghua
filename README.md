# 清风伴节气 廉韵润心田

> 探寻二十四节气里的中央八项规定智慧

## 项目简介

这是一个结合中国传统二十四节气文化与中央八项规定精神的H5动画网页项目。通过中国风手绘/水墨动画风格，将节气文化与廉政教育相结合，传递"遵规守纪如顺应天时，清正廉洁似四时有序"的主题。

## 功能特色

### 🎨 视觉设计
- 中国风手绘/水墨动画风格
- 四季主题色彩（春之青绿、夏之浓翠、秋之金黄、冬之素白）
- 融入廉洁元素（莲花、翠竹、青松、明月、清泉等）
- 响应式设计，适配各种移动设备

### 🎵 音效体验
- 古风背景音乐
- 语音朗读功能
- 音频控制选项

### 📱 交互功能
- 开篇四季流转动画
- 纵向卷轴式节气导航
- 点击/滑动选择节气
- 图片轮播展示
- 平滑过渡动画

### 📚 内容结构
- **12个核心节气**：立春、惊蛰、谷雨、小满、芒种、大暑、立秋、秋分、霜降、立冬、大雪、大寒
- **每个节气包含**：
  - 节气特色介绍
  - 廉政智慧阐释
  - 相关图片展示
  - 语音朗读内容

## 技术栈

- **前端框架**：Vue 3
- **构建工具**：Vite
- **路由管理**：Vue Router 4
- **样式方案**：原生CSS + CSS3动画
- **语音合成**：Web Speech API
- **响应式**：CSS Grid + Flexbox

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
cd h5donghua
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 项目结构

```
h5donghua/
├── public/                 # 静态资源
│   ├── audio/             # 音频文件
│   └── images/            # 图片资源
├── src/
│   ├── api/               # API接口
│   ├── assets/            # 项目资源
│   ├── components/        # 公共组件
│   ├── config/            # 配置文件
│   ├── layout/            # 布局组件
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   │   └── Home/          # 主页面
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML模板
├── package.json           # 项目配置
├── vite.config.js         # Vite配置
└── README.md              # 项目文档
```

## 核心功能说明

### 1. 开篇动画
- 四季流转效果展示
- 渐进式标题显示
- 自动播放或点击跳过

### 2. 主卷轴导航
- 12个节气网格布局
- 季节主题色彩区分
- 悬停动画效果
- 响应式适配

### 3. 节气详情页
- 节气视觉背景
- 音频朗读控制
- 廉政智慧卡片
- 图片轮播展示
- 返回导航功能

### 4. 交互优化
- 触摸友好设计
- 防误触处理
- 加载动画
- 错误处理

## 浏览器兼容性

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88
- 移动端浏览器支持

## 部署说明

### 静态部署
1. 执行 `npm run build` 构建项目
2. 将 `dist` 目录部署到静态服务器
3. 配置服务器支持 History 模式路由

### CDN优化
- 建议将图片、音频等静态资源上传至CDN
- 修改 `public` 目录下的资源引用路径

## 自定义配置

### 修改节气内容
编辑 `src/views/Home/index.vue` 中的 `seasons` 数据：

```javascript
seasons: [
  {
    id: 'lichun',
    name: '立春',
    icon: '🌱',
    season: 'spring',
    shortDesc: '新气象 · 务实调研',
    audioText: '春季开始，万物复苏，寓意新生与开端。',
    wisdomTitle: '"新气象" → "务实调研"',
    wisdomContent: '改进调查研究，倡导轻车简从、深入基层...',
    photos: ['图片描述1', '图片描述2', '图片描述3']
  }
  // ... 更多节气
]
```

### 修改主题色彩
编辑 `src/App.vue` 中的CSS变量：

```css
.spring-theme {
  --primary-color: #2ecc71;
  --secondary-color: #a8e6cf;
  --accent-color: #27ae60;
}
```

### 添加背景音乐
1. 将音频文件放入 `public/audio/` 目录
2. 修改 `src/views/Home/index.vue` 中的音频路径

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

**主办单位**：中国热科院纪检组

---

*循四时之序，守清廉之本。锲而不舍落实中央八项规定精神，涵养农业科研单位政治生态！*