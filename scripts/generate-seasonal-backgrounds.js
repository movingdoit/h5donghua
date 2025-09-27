const fs = require('fs');
const path = require('path');

// 确保目录存在
const backgroundsDir = path.join(__dirname, '../public/images/backgrounds');
if (!fs.existsSync(backgroundsDir)) {
  fs.mkdirSync(backgroundsDir, { recursive: true });
}

// 节气背景图片数据
const seasonalBackgrounds = {
  opening: {
    name: '开篇',
    colors: ['#1a1a2e', '#16213e', '#0f3460'],
    elements: ['四季轮回', '节气更替', '廉政之风']
  },
  lichun: {
    name: '立春',
    colors: ['#a8edea', '#fed6e3', '#d299c2'],
    elements: ['春芽萌发', '党员调研', '深入基层', '务实作风']
  },
  jingzhe: {
    name: '惊蛰',
    colors: ['#ffecd2', '#fcb69f', '#ff9a9e'],
    elements: ['春雷滚滚', '警示教育', '监狱参观', '思想防线']
  },
  guyu: {
    name: '谷雨',
    colors: ['#a8edea', '#fed6e3', '#d299c2'],
    elements: ['春雨滋润', '资源节约', '民生实事', '反对奢靡']
  },
  xiaoman: {
    name: '小满',
    colors: ['#ffecd2', '#fcb69f', '#ff9a9e'],
    elements: ['麦粒渐满', '八小时外', '健康情趣', '清廉社交']
  },
  mangzhong: {
    name: '芒种',
    colors: ['#a8edea', '#fed6e3', '#d299c2'],
    elements: ['农忙时节', '基层一线', '服务农民', '务实担当']
  },
  dashu: {
    name: '大暑',
    colors: ['#ff9a9e', '#fecfef', '#ffecd2'],
    elements: ['酷热考验', '阳光权力', '严守纪律', '抵制四风']
  },
  liqiu: {
    name: '立秋',
    colors: ['#ffecd2', '#fcb69f', '#ff9a9e'],
    elements: ['暑退凉生', '纪律监督', '巡察审计', '持续肃纪']
  },
  qiufen: {
    name: '秋分',
    colors: ['#e0c3fc', '#9bb5ff', '#667eea'],
    elements: ['昼夜均平', '执纪公正', '刚性约束', '不偏不倚']
  },
  shuangjiang: {
    name: '霜降',
    colors: ['#e0c3fc', '#9bb5ff', '#667eea'],
    elements: ['霜冻结弊', '风险防控', '思想防线', '抵御腐败']
  },
  lidong: {
    name: '立冬',
    colors: ['#667eea', '#764ba2', '#1a1a2e'],
    elements: ['万物收藏', '总结沉淀', '成果积累', '经验分享']
  },
  daxue: {
    name: '大雪',
    colors: ['#e0c3fc', '#9bb5ff', '#ffffff'],
    elements: ['洁白无瑕', '永葆纯洁', '清廉本色', '作风建设']
  },
  dahan: {
    name: '大寒',
    colors: ['#667eea', '#764ba2', '#1a1a2e'],
    elements: ['酷寒坚守', '高压态势', '严防反弹', '风清气正']
  },
  ending: {
    name: '结尾',
    colors: ['#667eea', '#764ba2', '#1a1a2e'],
    elements: ['四季轮回', '作风建设', '永远在路上', '热科院纪检组']
  }
};

// 生成SVG背景图片
function generateSeasonalSVG(id, data) {
  const { name, colors, elements } = data;
  
  const svg = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${colors[1]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:1" />
    </linearGradient>
    <radialGradient id="light-${id}" cx="50%" cy="30%" r="60%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.3);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:0" />
    </radialGradient>
    <filter id="glow-${id}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- 背景渐变 -->
  <rect width="1920" height="1080" fill="url(#bg-${id})"/>
  
  <!-- 光效层 -->
  <rect width="1920" height="1080" fill="url(#light-${id})"/>
  
  <!-- 装饰性元素 -->
  ${generateDecoElements(id, colors)}
  
  <!-- 节气标题 -->
  <text x="960" y="200" text-anchor="middle" font-family="serif" font-size="120" font-weight="bold" 
        fill="rgba(255,255,255,0.9)" filter="url(#glow-${id})">${name}</text>
  
  <!-- 关键词元素 -->
  ${elements.map((element, index) => `
    <text x="${300 + (index % 2) * 1320}" y="${400 + Math.floor(index / 2) * 150}" 
          text-anchor="middle" font-family="sans-serif" font-size="36" 
          fill="rgba(255,255,255,0.8)" opacity="0.9">${element}</text>
  `).join('')}
  
  <!-- 传统纹样 -->
  ${generateTraditionalPattern(colors)}
</svg>`;

  return svg.trim();
}

// 生成装饰元素
function generateDecoElements(id, colors) {
  const elements = [];
  
  // 根据不同节气生成不同的装饰元素
  if (id.includes('chun') || id === 'lichun' || id === 'jingzhe' || id === 'guyu') {
    // 春季：花瓣、嫩芽
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1920;
      const y = Math.random() * 1080;
      const size = Math.random() * 20 + 10;
      elements.push(`<circle cx="${x}" cy="${y}" r="${size}" fill="${colors[1]}" opacity="0.3"/>`);
    }
  } else if (id === 'dashu' || id === 'mangzhong') {
    // 夏季：阳光、热浪
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 1920;
      const y = Math.random() * 1080;
      const width = Math.random() * 100 + 50;
      const height = Math.random() * 20 + 5;
      elements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${colors[2]}" opacity="0.2" transform="rotate(${Math.random() * 360} ${x + width/2} ${y + height/2})"/>`);
    }
  } else if (id.includes('qiu') || id === 'liqiu' || id === 'qiufen' || id === 'shuangjiang') {
    // 秋季：落叶、霜花
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * 1920;
      const y = Math.random() * 1080;
      const size = Math.random() * 15 + 8;
      elements.push(`<polygon points="${x},${y} ${x+size},${y+size/2} ${x},${y+size} ${x-size},${y+size/2}" fill="${colors[1]}" opacity="0.4"/>`);
    }
  } else if (id.includes('dong') || id === 'lidong' || id === 'daxue' || id === 'dahan') {
    // 冬季：雪花、冰晶
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1920;
      const y = Math.random() * 1080;
      const size = Math.random() * 12 + 6;
      elements.push(`<g transform="translate(${x},${y})">
        <line x1="-${size}" y1="0" x2="${size}" y2="0" stroke="white" stroke-width="2" opacity="0.6"/>
        <line x1="0" y1="-${size}" x2="0" y2="${size}" stroke="white" stroke-width="2" opacity="0.6"/>
        <line x1="-${size*0.7}" y1="-${size*0.7}" x2="${size*0.7}" y2="${size*0.7}" stroke="white" stroke-width="1" opacity="0.4"/>
        <line x1="-${size*0.7}" y1="${size*0.7}" x2="${size*0.7}" y2="-${size*0.7}" stroke="white" stroke-width="1" opacity="0.4"/>
      </g>`);
    }
  }
  
  return elements.join('');
}

// 生成传统纹样
function generateTraditionalPattern(colors) {
  return `
    <!-- 云纹装饰 -->
    <path d="M100,900 Q200,850 300,900 T500,900" stroke="${colors[1]}" stroke-width="3" fill="none" opacity="0.3"/>
    <path d="M1420,900 Q1520,850 1620,900 T1820,900" stroke="${colors[1]}" stroke-width="3" fill="none" opacity="0.3"/>
    
    <!-- 回纹边框 -->
    <rect x="50" y="50" width="1820" height="980" stroke="${colors[2]}" stroke-width="4" fill="none" opacity="0.2"/>
    <rect x="80" y="80" width="1760" height="920" stroke="${colors[1]}" stroke-width="2" fill="none" opacity="0.3"/>
  `;
}

// 生成所有背景图片
Object.entries(seasonalBackgrounds).forEach(([id, data]) => {
  const svg = generateSeasonalSVG(id, data);
  const filePath = path.join(backgroundsDir, `${id}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated: ${id}.svg`);
});

console.log('所有节气背景图片生成完成！');