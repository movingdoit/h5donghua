# 本地构建和部署说明

## 🚀 构建本地可访问版本

### 方法一：使用优化构建脚本（推荐）
```bash
npm run build:local
```

这个命令会：
1. 构建项目
2. 优化所有路径为相对路径
3. 添加本地访问优化
4. 复制音频文件
5. 创建启动器页面

### 方法二：标准构建
```bash
npm run build
```

## 📁 构建后的文件结构
```
dist/
├── index.html          # 主页面（可直接双击打开）
├── launcher.html       # 启动器页面
├── assets/            # 静态资源
│   ├── js/           # JavaScript文件
│   ├── css/          # CSS文件
│   └── images/       # 图片文件
└── audio/            # 音频文件
    └── tts/          # 语音播报音频
```

## 🌐 访问方式

### 1. 直接打开（最简单）
直接双击 `dist/index.html` 文件即可在浏览器中打开

### 2. 使用启动器
双击 `dist/launcher.html`，选择访问方式

### 3. 本地服务器（推荐用于测试）
```bash
# 方法1：使用内置命令
npm run serve:dist

# 方法2：使用serve包
npx serve dist -p 3000

# 方法3：使用Python（如果已安装）
cd dist
python -m http.server 3000
```

## 🔧 配置说明

### Vite配置优化
- `base: './'` - 设置相对路径
- 优化资源文件名和目录结构
- 确保音频文件正确处理
- 移除可能导致本地访问问题的配置

### 本地访问优化
- 添加Content Security Policy
- 确保所有资源路径为相对路径
- 优化音频文件加载
- 兼容file://协议

## 📱 移动端测试

### 在手机上测试
1. 将 `dist` 文件夹复制到手机
2. 使用手机浏览器打开 `index.html`
3. 或者使用本地服务器，手机连接同一WiFi访问

### 使用本地服务器测试
```bash
# 启动服务器
npm run serve:dist

# 在手机浏览器中访问
http://你的电脑IP:3000
```

## 🎵 音频文件说明

### 语音播报功能
- 音频文件位置：`dist/audio/tts/`
- 如果音频文件不存在，会自动降级到其他播报方案
- 支持的格式：MP3（推荐）

### 生成音频文件
```bash
# 如果需要生成语音播报音频
node scripts/generate-audio.js
```

## 🐛 常见问题

### 1. 双击index.html无法正常显示
- 确保使用了 `npm run build:local` 构建
- 检查浏览器是否阻止了本地文件访问
- 尝试使用本地服务器方式访问

### 2. 音频播报不工作
- 检查 `dist/audio/tts/` 目录是否存在音频文件
- 在浏览器开发者工具中查看错误信息
- 尝试在不同浏览器中测试

### 3. 样式或功能异常
- 清除浏览器缓存
- 检查控制台是否有JavaScript错误
- 确保所有资源文件都已正确复制

## 📦 部署到服务器

### 静态文件服务器
将 `dist` 文件夹上传到任何静态文件服务器即可：
- Nginx
- Apache
- GitHub Pages
- Vercel
- Netlify

### 配置示例（Nginx）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|mp3|wav)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}