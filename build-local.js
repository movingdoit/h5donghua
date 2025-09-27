// 本地构建脚本 - 确保构建后可以直接打开index.html
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 开始构建本地可访问版本...')

try {
  // 1. 执行构建
  console.log('📦 正在构建项目...')
  execSync('npm run build', { stdio: 'inherit' })
  
  // 2. 检查构建结果
  const distPath = path.join(__dirname, 'dist')
  const indexPath = path.join(distPath, 'index.html')
  
  if (!fs.existsSync(indexPath)) {
    throw new Error('构建失败：找不到 dist/index.html')
  }
  
  // 3. 读取并优化index.html
  let indexContent = fs.readFileSync(indexPath, 'utf8')
  
  // 确保所有路径都是相对路径
  indexContent = indexContent.replace(/href="\//g, 'href="./')
  indexContent = indexContent.replace(/src="\//g, 'src="./')
  
  // 添加本地访问优化的meta标签
  const metaTags = `
  <!-- 本地访问优化 -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; media-src 'self' data: blob:;">
  <meta name="referrer" content="no-referrer">
  `
  
  indexContent = indexContent.replace('</head>', metaTags + '</head>')
  
  // 写回文件
  fs.writeFileSync(indexPath, indexContent)
  
  // 4. 复制音频文件到dist目录
  const publicAudioPath = path.join(__dirname, 'public', 'audio')
  const distAudioPath = path.join(distPath, 'audio')
  
  if (fs.existsSync(publicAudioPath)) {
    console.log('🎵 复制音频文件...')
    copyDirectory(publicAudioPath, distAudioPath)
  }
  
  // 5. 创建本地服务器脚本（可选）
  const serverScript = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>本地服务器启动器</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
        .btn { padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>节气H5应用</h1>
    <p>选择访问方式：</p>
    <button class="btn" onclick="openLocal()">直接打开 (推荐)</button>
    <button class="btn" onclick="startServer()">启动本地服务器</button>
    
    <script>
        function openLocal() {
            window.location.href = './index.html';
        }
        
        function startServer() {
            alert('请在命令行中运行: npx serve dist -p 3000');
        }
    </script>
</body>
</html>
  `
  
  fs.writeFileSync(path.join(distPath, 'launcher.html'), serverScript)
  
  console.log('✅ 构建完成！')
  console.log('📁 构建文件位置:', distPath)
  console.log('🌐 访问方式:')
  console.log('   1. 直接双击: dist/index.html')
  console.log('   2. 使用启动器: dist/launcher.html')
  console.log('   3. 本地服务器: npx serve dist -p 3000')
  
} catch (error) {
  console.error('❌ 构建失败:', error.message)
  process.exit(1)
}

// 递归复制目录
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  
  const files = fs.readdirSync(src)
  
  for (const file of files) {
    const srcPath = path.join(src, file)
    const destPath = path.join(dest, file)
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}