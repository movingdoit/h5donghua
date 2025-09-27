// TTS 备用方案工具类
export class TTSFallback {
  constructor() {
    this.currentAudio = null
    this.isPlaying = false
  }

  // 检测设备兼容性
  detectCompatibility() {
    const userAgent = navigator.userAgent.toLowerCase()
    
    return {
      isVivo: userAgent.includes('vivo'),
      isOppo: userAgent.includes('oppo'),
      isHuawei: userAgent.includes('huawei'),
      isMobile: /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
      supportsSpeechSynthesis: 'speechSynthesis' in window,
      supportsAudio: 'Audio' in window
    }
  }

  // 多服务TTS URL生成
  generateTTSUrls(text) {
    const encodedText = encodeURIComponent(text)
    
    return [
      // 百度翻译TTS（最稳定）
      `https://fanyi.baidu.com/gettts?lan=zh&text=${encodedText}&spd=3&source=web`,
      
      // Google翻译TTS
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=zh-cn&client=tw-ob`,
      
      // 有道TTS
      `https://tts.voicetech.youdao.com/webapi/tts?text=${encodedText}&voice=zh-CN-XiaoxiaoNeural&rate=0&pitch=0`,
      
      // 微软TTS
      `https://speech.platform.bing.com/synthesize?text=${encodedText}&voice=zh-CN-XiaoxiaoNeural&format=audio-16khz-32kbitrate-mono-mp3`
    ]
  }

  // 尝试多个TTS服务
  async tryMultipleTTS(text, onSuccess, onError) {
    const urls = this.generateTTSUrls(text)
    
    for (let i = 0; i < urls.length; i++) {
      try {
        console.log(`🔄 尝试TTS服务 ${i + 1}/${urls.length}:`, urls[i])
        
        const success = await this.tryTTSUrl(urls[i], onSuccess, onError)
        if (success) {
          console.log(`✅ TTS服务 ${i + 1} 成功`)
          return true
        }
      } catch (error) {
        console.log(`❌ TTS服务 ${i + 1} 失败:`, error.message)
        continue
      }
    }
    
    console.log('❌ 所有TTS服务都失败，使用文字显示')
    return false
  }

  // 尝试单个TTS URL
  tryTTSUrl(url, onSuccess, onError) {
    return new Promise((resolve) => {
      if (this.currentAudio) {
        this.currentAudio.pause()
        this.currentAudio = null
      }

      this.currentAudio = new Audio()
      this.currentAudio.crossOrigin = 'anonymous'
      this.currentAudio.preload = 'auto'
      
      let resolved = false
      
      const cleanup = () => {
        if (!resolved) {
          resolved = true
          this.currentAudio = null
          this.isPlaying = false
        }
      }

      // 成功事件
      this.currentAudio.oncanplaythrough = () => {
        if (!resolved) {
          resolved = true
          console.log('✅ 音频可以播放')
          resolve(true)
        }
      }

      this.currentAudio.onplay = () => {
        this.isPlaying = true
        if (onSuccess) onSuccess()
      }

      this.currentAudio.onended = () => {
        cleanup()
        if (onSuccess) onSuccess()
      }

      // 错误事件
      this.currentAudio.onerror = (error) => {
        cleanup()
        if (onError) onError(error)
        resolve(false)
      }

      // 超时处理
      setTimeout(() => {
        if (!resolved) {
          cleanup()
          resolve(false)
        }
      }, 5000) // 5秒超时

      // 设置音频源
      this.currentAudio.src = url
      
      // 尝试播放
      this.currentAudio.play().catch(error => {
        cleanup()
        if (onError) onError(error)
        resolve(false)
      })
    })
  }

  // 停止播放
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
    this.isPlaying = false
  }

  // 检查是否正在播放
  isCurrentlyPlaying() {
    return this.isPlaying && this.currentAudio && !this.currentAudio.paused
  }
}