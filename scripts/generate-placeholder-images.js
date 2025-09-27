// 生成占位符背景图片的脚本
// 运行: node scripts/generate-placeholder-images.js

const fs = require('fs');
const path = require('path');

// 创建SVG占位符图片
function createSVGPlaceholder(width, height, text, colors) {
  const gradient = colors.map((color, index) => 
    `<stop offset="${index * 100 / (colors.length - 1)}%" style="stop-color:${color};stop-opacity:1" />`
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradient}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad1)" />
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.8">
    ${text}
  </text>
</svg>`;
}

// 节气背景配置
const backgrounds = {
  'opening.svg': {
    text: '开场',
    colors: ['#2c3e50', '#34495e', '#4a6741']
  },
  'lichun.svg': {
    text: '立春',
    colors: ['#a8e6cf', '#dcedc1', '#ffd3a5']
  },
  'jingzhe.svg': {
    text: '惊蛰', 
    colors: ['#667eea', '#764ba2', '#a8e6cf']
  },
  'guyu.svg': {
    text: '谷雨',
    colors: ['#74b9ff', '#0984e3', '#a8e6cf']
  },
  'xiaoman.svg': {
    text: '小满',
    colors: ['#4facfe', '#00f2fe', '#43e97b']
  },
  'mangzhong.svg': {
    text: '芒种',
    colors: ['#f7b733', '#fc4a1a', '#43e97b']
  },
  'dashu.svg': {
    text: '大暑',
    colors: ['#ff9a9e', '#fecfef', '#fecfef']
  },
  'liqiu.svg': {
    text: '立秋',
    colors: ['#fa709a', '#fee140', '#ffa726']
  },
  'qiufen.svg': {
    text: '秋分',
    colors: ['#667eea', '#764ba2', '#fa709a']
  },
  'shuangjiang.svg': {
    text: '霜降',
    colors: ['#a8edea', '#fed6e3', '#fa709a']
  },
  'lidong.svg': {
    text: '立冬',
    colors: ['#a8edea', '#fed6e3', '#d299c2']
  },
  'daxue.svg': {
    text: '大雪',
    colors: ['#e6f3ff', '#ffffff', '#d299c2']
  },
  'dahan.svg': {
    text: '大寒',
    colors: ['#667eea', '#764ba2', '#d299c2']
  },
  'ending.svg': {
    text: '结尾',
    colors: ['#ffd700', '#ff8c00', '#ffa500']
  }
};

// 创建目录
const backgroundsDir = path.join(__dirname, '../public/images/backgrounds');
if (!fs.existsSync(backgroundsDir)) {
  fs.mkdirSync(backgroundsDir, { recursive: true });
}

// 生成所有背景图片
Object.entries(backgrounds).forEach(([filename, config]) => {
  const svg = createSVGPlaceholder(1920, 1080, config.text, config.colors);
  const filepath = path.join(backgroundsDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✅ 生成占位符图片: ${filename}`);
});

console.log('\n🎉 所有占位符背景图片生成完成！');
console.log('📁 位置:', backgroundsDir);
console.log('\n💡 提示:');
console.log('1. 这些是SVG格式的占位符图片');
console.log('2. 您可以用真实的JPG/PNG图片替换它们');
console.log('3. 保持相同的文件名即可自动加载');
console.log('4. 推荐尺寸: 1920x1080 (16:9比例)');