// 生成节气音频文件的脚本
// 使用Node.js + edge-tts 生成高质量中文语音

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

// 节气数据
const solarTermsData = {
  '立春': '立春，是二十四节气中的第一个节气，标志着春季的开始。此时，大地回春，万物复苏，气温逐渐回暖。立春时节，人们要注意保暖，适当增加户外活动，调养身体，迎接新的一年。',
  
  '惊蛰': '惊蛰，是春季的第三个节气，标志着春雷始鸣，蛰虫惊醒。此时天气转暖，春雷阵阵，万物开始活跃起来。惊蛰时节，要注意养肝护脾，多吃清淡食物，保持心情舒畅。',
  
  '谷雨': '谷雨，是春季的最后一个节气，有"雨生百谷"之意。此时雨水充沛，有利于谷类作物的生长。谷雨时节，要注意防湿祛湿，适当运动，调理脾胃功能。',
  
  '小满': '小满，是夏季的第二个节气，标志着夏熟作物的籽粒开始灌浆饱满。此时气温升高，雨水增多，要注意防暑降温，清淡饮食，保持心境平和。',
  
  '芒种': '芒种，是夏季的第三个节气，标志着有芒的麦类作物成熟。此时天气炎热，要注意防暑养心，多吃清热解毒的食物，保持充足的睡眠。',
  
  '大暑': '大暑，是夏季最热的节气，一年中气温最高的时期。此时要特别注意防暑降温，多喝水，避免长时间在烈日下活动，保持室内通风。',
  
  '立秋': '立秋，是秋季的第一个节气，标志着秋季的开始。虽然天气依然炎热，但已有凉意。立秋时节，要注意润燥养肺，适当进补，为秋冬做准备。',
  
  '秋分': '秋分，是秋季的第四个节气，昼夜平分，寒暑平衡。此时天高气爽，是收获的季节。秋分时节，要注意保暖，多吃滋阴润燥的食物。',
  
  '霜降': '霜降，是秋季的最后一个节气，标志着天气渐冷，开始有霜。此时要注意保暖，特别是早晚温差大，要适时增减衣物，预防感冒。',
  
  '立冬': '立冬，是冬季的第一个节气，标志着冬季的开始。此时天气转冷，万物收藏。立冬时节，要注意保暖，适当进补，储备能量过冬。',
  
  '大雪': '大雪，是冬季的第三个节气，标志着天气更加寒冷，降雪量增大。此时要特别注意保暖，多吃温热食物，适当运动增强体质。',
  
  '大寒': '大寒，是二十四节气中的最后一个节气，也是一年中最寒冷的时期。此时要做好防寒保暖，注意养肾，为来年春天做好准备。'
}

// 音频文件映射
const audioFileMap = {
  '立春': 'lichun.mp3',
  '惊蛰': 'jingzhe.mp3', 
  '谷雨': 'guyu.mp3',
  '小满': 'xiaoman.mp3',
  '芒种': 'mangzhong.mp3',
  '大暑': 'dashu.mp3',
  '立秋': 'liqiu.mp3',
  '秋分': 'qiufen.mp3',
  '霜降': 'shuangjiang.mp3',
  '立冬': 'lidong.mp3',
  '大雪': 'daxue.mp3',
  '大寒': 'dahan.mp3'
}

// 创建音频目录
const audioDir = path.join(__dirname, '../public/audio/tts')
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true })
}

// 生成音频文件
async function generateAudioFiles() {
  console.log('🎵 开始生成节气音频文件...')
  
  for (const [termName, description] of Object.entries(solarTermsData)) {
    const fileName = audioFileMap[termName]
    const filePath = path.join(audioDir, fileName)
    
    console.log(`🔊 生成 ${termName} 音频: ${fileName}`)
    
    // 使用edge-tts生成音频
    const command = `edge-tts --voice zh-CN-YunxiNeural --text "${description}" --write-media "${filePath}"`
    
    try {
      await execCommand(command)
      console.log(`✅ ${termName} 音频生成成功`)
    } catch (error) {
      console.error(`❌ ${termName} 音频生成失败:`, error.message)
    }
  }
  
  console.log('🎉 所有音频文件生成完成！')
}

// 执行命令的Promise包装
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}

// 检查edge-tts是否安装
function checkEdgeTTS() {
  return new Promise((resolve) => {
    exec('edge-tts --help', (error) => {
      if (error) {
        console.log('❌ edge-tts 未安装')
        console.log('📦 请先安装: pip install edge-tts')
        console.log('🔗 或者访问: https://github.com/rany2/edge-tts')
        resolve(false)
      } else {
        console.log('✅ edge-tts 已安装')
        resolve(true)
      }
    })
  })
}

// 主函数
async function main() {
  console.log('🚀 节气音频生成器启动')
  
  const hasEdgeTTS = await checkEdgeTTS()
  if (!hasEdgeTTS) {
    console.log('\n📝 手动生成说明:')
    console.log('1. 安装 edge-tts: pip install edge-tts')
    console.log('2. 运行此脚本: node generate-audio.js')
    console.log('3. 或者使用在线TTS工具手动生成音频文件')
    return
  }
  
  await generateAudioFiles()
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  solarTermsData,
  audioFileMap,
  generateAudioFiles
}