<template>
  <div class="home-container">
    <!-- 语音控制按钮 -->
    <div class="speech-controls">
      <button 
        class="speech-btn"
        @click="toggleSpeech"
        :class="{ 'active': isSpeaking }"
        :title="isSpeaking ? '停止朗读' : '开始朗读'"
      >
        {{ isSpeaking ? '🔇' : '🔊' }}
      </button>
    </div>
    
    <!-- 背景音乐 -->
    <audio 
      ref="backgroundMusic" 
      loop 
      preload="auto"
      :volume="backgroundVolume"
      style="display: none;"
      src="/audio/bg-music.mp3"
    >
    </audio>

    <!-- 全屏幻灯片背景 -->
    <div class="slideshow-container">
      <!-- 背景图片 -->
      <div 
        v-for="(term, index) in solarTerms" 
        :key="`slide-${term.id}`"
        class="slide"
        :class="{ 'active': index === currentSlide }"
        :style="{ 
          backgroundImage: `url(${term.background})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }"
      >
        <!-- 节气信息覆盖层 -->
        <div class="slide-overlay">
          <div class="slide-content">
            <h1 class="slide-title">{{ term.name }}</h1>
            <p class="slide-theme">{{ term.theme }}</p>
            <p class="slide-description">{{ term.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 左右切换按钮 -->
    <button 
      class="nav-btn nav-btn-prev" 
      @click="prevSlide"
      :disabled="currentSlide === 0"
    >
    </button>
    <button 
      class="nav-btn nav-btn-next" 
      @click="nextSlide"
    >
    </button>

    <!-- 幻灯片指示器 -->
    <div class="slide-indicators">
      <button
        v-for="(term, index) in solarTerms"
        :key="`indicator-${index}`"
        class="indicator"
        :class="{ 'active': index === currentSlide }"
        @click="goToSlide(index)"
      >
        {{ index + 1 }}
      </button>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <button 
        class="control-btn"
        @click="toggleAutoPlay"
        :class="{ 'active': isAutoPlay }"
      >
        {{ isAutoPlay ? '⏸️ 暂停自动播放' : '▶️ 开始自动播放' }}
      </button>
      <button 
        class="control-btn speech-btn"
        @click="toggleSpeech"
        :class="{ 'active': isSpeaking }"
        :title="isSpeaking ? '停止朗读' : '开始朗读'"
      >
        {{ isSpeaking ? '🔇 停止朗读' : '🔊 开始朗读' }}
      </button>
      <div class="slide-counter">
        {{ currentSlide + 1 }} / {{ solarTerms.length }}
      </div>
    </div>
    
    <!-- 结尾呼吁页面 -->
    <transition name="ending">
      <div v-if="showEnding" class="ending-section">

      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      currentSlide: 0,
      isAutoPlay: false,
      autoPlayTimer: null,
      autoPlayInterval: 5000, // 5秒自动切换
      showEnding: false,
      
      // 音频相关
      isBackgroundMusicPlaying: true,
      backgroundVolume: 0.3,
      
      // 语音朗读相关
      isSpeaking: false,
      currentUtterance: null,
      speechMethod: 'local-audio',
      audioSpeech: null,
      audioFileMap: {},
      
      solarTerms: [
        // 1. 大暑
        {
          id: 1,
          name: '大暑',
          theme: '酷热考验 → 廉洁坚守',
          description: '一年最热时，考验耐受力，需坚守清凉。高温考验下更需严守纪律，抵制"四风"侵袭。',
          season: 'summer',
          ico: '/images/ico/dashu.png',
          background: '/images/backgrounds/dashu.jpg',
          background1: '/images/icobackgrounds/xiatian.jpg',
          titlepng: '/images/font/dashu_title.png',
          titlePosition: { top: '70px', left: '40%', transform: 'translateX(-50%)' },
          themePosition: { bottom: '250px', left: '60%', transform: 'translateX(-50%)' },
          bgod: ''
        },
        // 2. 立秋
        {
          id: 2,
          name: '立秋',
          theme: '暑退凉生 → 持续肃纪',
          description: '暑气渐退，凉意初生，在季节转换之际，更应保持监督力度不变，防止"四风"问题隐形变异、反弹回潮，巩固整治成果。',
          season: 'autumn',
          ico: '/images/ico/liqiu.png',
          background: '/images/backgrounds/liqiu.jpg',
          background1: '/images/icobackgrounds/qiutian.jpg',
          titlepng: '/images/font/liqiu_title.png',
          titlePosition: { bottom: '280px', right: '25%', transform: 'translateX(50%)' },
          themePosition: { top: '270px', right: '10%', transform: 'translateX(50%)' },
          bgod: ''
        },
        // 3. 秋分
        {
          id: 3,
          name: '秋分',
          theme: '昼夜均平 → 执纪公正',
          description: '昼夜平分，象征公平、公正、平衡。监督执纪需公平公正，不偏不倚。',
          season: 'autumn',
          ico: '/images/ico/qiufen.png',
          background: '/images/backgrounds/qiufen.jpg',
          background1: '/images/icobackgrounds/qiutian.jpg',
          titlepng: '/images/font/qiufen_title.png',
          titlePosition: { top: '85px', right: '20%', transform: 'translateX(50%)' },
          themePosition: { bottom: '180px', left: '35%', transform: 'translateX(-50%)' },
          bgod: ''
        },
        // 4. 霜降
        {
          id: 4,
          name: '霜降',
          theme: '霜冻结弊 → 筑牢防线',
          description: '露结为霜，寒意加剧，需巩固根本、抵御严寒。持续宣贯廉政风险防控制度，筑牢党员干部思想防线，堵住风险漏洞。 ',
          season: 'autumn',
          ico: '/images/ico/shuangjiang.png',
          background: '/images/backgrounds/shuangjiang.jpg',
          background1: '/images/icobackgrounds/qiutian.jpg',
          titlepng: '/images/font/shuangjiang_title.png',
          titlePosition: { top: '105px', left: '50%', transform: 'translateX(-50%)' },
          themePosition: { bottom: '160px', left: '50%', transform: 'translateX(-50%)' },
          bgod: ''
        },
        // 5. 立冬
        {
          id: 5,
          name: '立冬',
          theme: '万物收藏 → 总结沉淀',
          description: '冬季开始，万物休养，积蓄能量。总结深入贯彻中央八项规定精神学习教育，积累经验，为下步工作蓄力。',
          season: 'winter',
          ico: '/images/ico/lidong.png',
          background: '/images/backgrounds/lidong.jpg',
          background1: '/images/icobackgrounds/dongtian.jpg',
          titlepng: '/images/font/lidong_title.png',
          titlePosition: { bottom: '320px', left: '25%', transform: 'translateX(-50%)' },
          themePosition: { top: '235px', right: '15%', transform: 'translateX(50%)' },
          bgod: ''
        },
        // 6. 大雪
        {
          id: 6,
          name: '大雪',
          theme: '洁白无瑕 → 永葆纯洁',
          description: '大雪覆盖，世界洁白，象征纯洁、无暇。矢志追求清廉政治本色，永葆如雪纯洁底色。',
          season: 'winter',
          ico: '/images/ico/daxue.png',
          background: '/images/backgrounds/daxue.jpg',
          background1: '/images/icobackgrounds/dongtian.jpg',
          titlepng: '/images/font/daxue_title.png',
          titlePosition: { top: '115px', right: '10%', transform: 'translateX(50%)' },
          themePosition: { bottom: '140px', left: '25%', transform: 'translateX(-50%)' },
          bgod: ''
        },
        // 7. 大寒
        {
          id: 7,
          name: '大寒',
          theme: '酷寒坚守 → 严防反弹',
          description: '一年最冷时节，考验极限，需坚守以待春归。保持高压态势，严防"四风"反弹回潮，持续营造风清气正的氛围。',
          season: 'winter',
          ico: '/images/ico/lichun.png',
          background: '/images/backgrounds/dahan.jpg',
          background1: '/images/icobackgrounds/dongtian.jpg',
          titlepng: '/images/font/dahan_title.png',
          titlePosition: { bottom: '350px', left: '55%', transform: 'translateX(-50%)' },
          themePosition: { bottom: '200px', right: '30%', transform: 'translateX(50%)' },
          bgod: ''
        },
        // 8. 立春
        {
          id: 8,
          name: '立春',
          theme: '新气象 → 务实调研',
          description: '春季开始，万物复苏，寓意新生与开端。改进调查研究，倡导轻车简从、深入基层，以务实作风开启全年工作。',
          season: 'spring',
          ico: '/images/ico/lichun.png',
          background: '/images/backgrounds/lichun.jpg',
          background1: '/images/icobackgrounds/chuntian.jpg',
          titlepng: '/images/font/lichun_title.png',
          titlePosition: { top: '1rem', right: '5rem', width:'35rem' },
          themePosition: { top: '5.5rem', right: '5rem', width:'35rem' },
          bgod: ''
        },
        // 9. 惊蛰
        {
          id: 9,
          name: '惊蛰',
          theme: '祛除蛰虫 → 整治四风',
          description: '春雷惊醒蛰虫，象征清除积弊、焕发生机。强化警示教育，坚持抓早抓小、防微杜渐，以如春雷惊蛰般的警醒之力，筑牢思想防线。',
          season: 'spring',
          ico: '/images/ico/jingzhe.png',
          background: '/images/backgrounds/jingzhe.jpg',
          background1: '/images/icobackgrounds/chuntian.jpg',
          titlepng: '/images/font/jingzhe_title.png',
          titlePosition: { top: '100px', left: '45%', transform: 'translateX(-50%)' },
          themePosition: { top: '240px', left: '55%', transform: 'translateX(-50%)' },
          bgod: ''
        },
        // 10. 谷雨
        {
          id: 10,
          name: '谷雨',
          theme: '雨生百谷 → 资源惠民',
          description: '雨水滋润禾苗，滋养万物，强调资源用于根本。严守经费支出红线，把资源节约贯穿全程，优先投向单位发展刚需与民生实事，坚决抵制奢靡享乐之风。',
          season: 'spring',
          ico: '/images/ico/lichun.png',
          background: '/images/backgrounds/guyu.jpg',
          background1: '/images/icobackgrounds/chuntian.jpg',
          titlepng: '/images/font/guyu_title.png',
          titlePosition: { top: '120px', left: '60%', transform: 'translateX(-50%)' },
          themePosition: { bottom: '200px', right: '10%', transform: 'translateX(50%)' },
          bgod: ''
        },
        // 11. 小满
        {
          id: 11,
          name: '小满',
          theme: '充盈有度 → 守界清廉',
          description: '麦粒渐满，将至未盈，党员干部在"八小时外"的个人生活、社交交往中保持清醒，培养健康情趣，抵制诱惑，防止小事小节失守。',
          season: 'summer',
          ico: '/images/ico/xiaoman.png',
          background: '/images/backgrounds/xiaoman.jpg',
          background1: '/images/icobackgrounds/xiatian.jpg',
          titlepng: '/images/font/xiaoman_title.png',
          titlePosition: { bottom: '300px', left: '30%', transform: 'translateX(-50%)' },
          themePosition: { top: '230px', right: '20%', transform: 'translateX(50%)' },
          bgod: 'bottom '
        },
        // 12. 芒种
        {
          id: 12,
          name: '芒种',
          theme: '勤勉耕耘 → 务实为民',
          description: '农忙时节，辛勤劳作、脚踏实地。党员干部应沉身田间，务实察民情、解民忧，摒走马观花形式主义，用务实成效彰显担当作为。',
          season: 'summer',
          ico: '/images/ico/mangzhong.png',
          background: '/images/backgrounds/mangzhong.jpg',
          background1: '/images/icobackgrounds/xiatian.jpg',
          titlepng: '/images/font/mangzhong_title.png',
          titlePosition: { top: '110px', right: '15%', transform: 'translateX(50%)' },
          themePosition: { bottom: '150px', left: '30%', transform: 'translateX(-50%)' },
          bgod: ''
        }
      ]
    }
  },
  mounted() {
    this.initAudio()
    this.initSpeechSynthesis()
    
    // 页面加载完成后先播放立春的播报
    this.$nextTick(() => {
      this.startInitialReading()
    })
  },
  beforeUnmount() {
    this.stopAutoPlay()
    this.stopSpeaking()
  },
  methods: {
    // 上一张幻灯片
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--
        this.resetAutoPlay()
        // 自动开始朗读当前幻灯片内容
        this.startCurrentSlideReading()
      }
    },

    // 下一张幻灯片
    nextSlide() {
      if (this.currentSlide < this.solarTerms.length - 1) {
        this.currentSlide++
        this.resetAutoPlay()
        // 自动开始朗读当前幻灯片内容
        this.startCurrentSlideReading()
      } else {
        // 到达最后一张，显示结束页
        this.showEndingPage()
      }
    },

    // 跳转到指定幻灯片
    goToSlide(index) {
      this.currentSlide = index
      this.resetAutoPlay()
      // 自动开始朗读当前幻灯片内容
      this.startCurrentSlideReading()
    },

    // 切换自动播放
    toggleAutoPlay() {
      if (this.isAutoPlay) {
        this.stopAutoPlay()
      } else {
        this.startAutoPlay()
      }
    },

    // 开始自动播放
    startAutoPlay() {
      this.isAutoPlay = true
      this.autoPlayTimer = setInterval(() => {
        if (this.currentSlide < this.solarTerms.length - 1) {
          this.currentSlide++
        } else {
          // 到达最后一张，显示结束页
          this.showEndingPage()
        }
      }, this.autoPlayInterval)
    },

    // 停止自动播放
    stopAutoPlay() {
      this.isAutoPlay = false
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer)
        this.autoPlayTimer = null
      }
    },

    // 重置自动播放
    resetAutoPlay() {
      if (this.isAutoPlay) {
        this.stopAutoPlay()
        this.startAutoPlay()
      }
    },

    // 显示结尾页面
    showEndingPage() {
      this.stopAutoPlay()
      
      // 停止所有音频播放
      this.stopSpeaking()
      this.stopBackgroundMusic()
      
      this.showEnding = true
    },

    // 返回欢迎页面
    backToWelcome() {
      window.location.href = '/'
    },



    // 初始化音频
    initAudio() {
      this.$nextTick(() => {
        try {
          const bgMusic = this.$refs.backgroundMusic
          if (bgMusic) {
            bgMusic.volume = this.backgroundVolume
            bgMusic.addEventListener('ended', () => {
              this.isBackgroundMusicPlaying = false
            })
            bgMusic.addEventListener('pause', () => {
              this.isBackgroundMusicPlaying = false
            })
            bgMusic.addEventListener('play', () => {
              this.isBackgroundMusicPlaying = true
            })
            bgMusic.addEventListener('error', (e) => {
              console.log('背景音乐加载错误:', e)
              this.isBackgroundMusicPlaying = false
            })
            
            // 预加载音频
            bgMusic.load()
            console.log('🎵 背景音乐初始化完成')
          }
        } catch (error) {
          console.log('音频初始化失败:', error)
        }
      })
    },

    // 自动播放背景音乐
    autoPlayBackgroundMusic() {
      console.log('🎵 尝试自动播放背景音乐...')
      const bgMusic = this.$refs.backgroundMusic
      if (bgMusic) {
        // 设置音量
        bgMusic.volume = this.backgroundVolume
        
        // 尝试自动播放
        const playPromise = bgMusic.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ 背景音乐自动播放成功')
              this.isBackgroundMusicPlaying = true
            })
            .catch(error => {
              console.log('⚠️ 自动播放被浏览器阻止:', error.message)
              console.log('💡 用户需要手动点击页面后才能播放音乐')
              this.isBackgroundMusicPlaying = false
              
              // 添加用户交互监听器，一旦用户点击页面就播放音乐
              this.addUserInteractionListener()
            })
        }
      }
    },

    // 添加用户交互监听器
    addUserInteractionListener() {
      const playOnInteraction = () => {
        console.log('🖱️ 检测到用户交互')
        const bgMusic = this.$refs.backgroundMusic
        // 只有在没有播报时才尝试播放背景音乐
        if (bgMusic && !this.isBackgroundMusicPlaying && !this.isSpeaking) {
          console.log('🎵 尝试播放背景音乐（无播报状态）')
          bgMusic.play()
            .then(() => {
              console.log('✅ 用户交互后背景音乐播放成功')
              this.isBackgroundMusicPlaying = true
              // 移除监听器
              document.removeEventListener('click', playOnInteraction)
              document.removeEventListener('touchstart', playOnInteraction)
              document.removeEventListener('keydown', playOnInteraction)
            })
            .catch(e => {
              console.log('用户交互后播放失败:', e.message)
            })
        } else if (this.isSpeaking) {
          console.log('🔇 当前正在播报，不播放背景音乐')
          // 移除监听器，等播报结束后再处理
          document.removeEventListener('click', playOnInteraction)
          document.removeEventListener('touchstart', playOnInteraction)
          document.removeEventListener('keydown', playOnInteraction)
        }
      }

      // 监听各种用户交互事件
      document.addEventListener('click', playOnInteraction, { once: true })
      document.addEventListener('touchstart', playOnInteraction, { once: true })
      document.addEventListener('keydown', playOnInteraction, { once: true })
      
      console.log('👆 已添加用户交互监听器，等待用户点击页面')
    },

    // 初始化语音合成
    initSpeechSynthesis() {
      console.log('🎤 初始化语音播报功能...')
      
      // 优先使用本地预录音频（100%兼容）
      this.speechMethod = 'local-audio'
      console.log('✅ 使用本地预录音频播报')
      
      // 初始化音频文件映射
      this.initAudioFileMap()
    },

    // 初始化音频文件映射
    initAudioFileMap() {
      this.audioFileMap = {
        '立春': '/audio/tts/lichun.mp3',
        '惊蛰': '/audio/tts/jingzhe.mp3', 
        '谷雨': '/audio/tts/guyu.mp3',
        '小满': '/audio/tts/xiaoman.mp3',
        '芒种': '/audio/tts/mangzhong.mp3',
        '大暑': '/audio/tts/dashu.mp3',
        '立秋': '/audio/tts/liqiu.mp3',
        '秋分': '/audio/tts/qiufen.mp3',
        '霜降': '/audio/tts/shuangjiang.mp3',
        '立冬': '/audio/tts/lidong.mp3',
        '大雪': '/audio/tts/daxue.mp3',
        '大寒': '/audio/tts/dahan.mp3'
      }
      console.log('📁 音频文件映射已初始化')
    },

    // 初始化时播放当前幻灯片的播报
    startInitialReading() {
      console.log('🎯 Home初始化完成，开始播放当前节气播报')
      const currentTerm = this.solarTerms[this.currentSlide] // 根据当前幻灯片索引获取节气
      if (currentTerm && currentTerm.description) {
        setTimeout(() => {
          console.log('🎯 开始播放节气播报:', currentTerm.name, '(索引:', this.currentSlide, ')')
          this.speakDescription(currentTerm.description, currentTerm.name, true) // 传入true表示是初始播报
        }, 1000) // 延迟1秒开始播报，确保页面完全加载
      }
    },

    // 开始朗读当前幻灯片内容
    startCurrentSlideReading() {
      const currentTerm = this.solarTerms[this.currentSlide]
      if (currentTerm && currentTerm.description) {
        setTimeout(() => {
          console.log('🎯 自动开始朗读:', currentTerm.name)
          this.speakDescription(currentTerm.description, currentTerm.name)
        }, 500) // 延迟500ms开始朗读，让幻灯片切换动画完成
      }
    },

    // 切换语音播报
    toggleSpeech() {
      if (this.isSpeaking) {
        console.log('🔇 用户停止朗读')
        this.stopSpeaking()
      } else {
        const currentTerm = this.solarTerms[this.currentSlide]
        if (currentTerm && currentTerm.description) {
          console.log('🔊 用户开始朗读:', currentTerm.name)
          this.speakDescription(currentTerm.description, currentTerm.name)
        }
      }
    },

    // 朗读描述内容
    speakDescription(text, termName, isInitial = false) {
      console.log('🎯 开始播报功能，使用方案:', this.speechMethod)
      console.log('📝 播报内容:', text)
      
      if (!text || text.trim() === '') {
        console.error('❌ 文本为空，无法播报')
        return
      }

      // 播报开始时暂停背景音乐
      this.pauseBackgroundMusic()

      // 停止当前播报
      this.stopSpeaking()
      
      // 根据支持的方案选择播报方式
      switch (this.speechMethod) {
        case 'local-audio':
          this.speakWithLocalAudio(termName, text.trim(), isInitial)
          break
        case 'native':
          this.speakWithNative(text.trim(), isInitial)
          break
        default:
          this.speakWithNative(text.trim(), isInitial)
      }
    },

    // 本地音频播报
    async speakWithLocalAudio(termName, text, isInitial = false) {
      try {
        console.log('🔊 使用本地音频播报:', termName)
        
        // 停止当前播报
        this.stopSpeaking()
        
        // 获取音频文件路径
        const audioPath = this.audioFileMap[termName]
        if (!audioPath) {
          console.log('❌ 找不到音频文件，降级到原生API')
          this.speakWithNative(text, isInitial)
          return
        }
        
        console.log('📁 音频文件路径:', audioPath)
        
        // 设置播报开始状态
        this.isSpeaking = true
        
        // 创建音频元素
        if (this.audioSpeech) {
          this.audioSpeech.pause()
          this.audioSpeech = null
        }
        
        this.audioSpeech = new Audio()
        this.audioSpeech.preload = 'auto'
        
        // 设置事件监听器
        this.audioSpeech.onplay = () => {
          console.log('✅ 本地音频播报开始')
          this.isSpeaking = true
        }
        
        this.audioSpeech.onended = () => {
          console.log('✅ 本地音频播报结束')
          this.isSpeaking = false
          this.audioSpeech = null
          // 播报结束后播放背景音乐
          this.resumeBackgroundMusic(isInitial)
        }
        
        this.audioSpeech.onerror = (error) => {
          console.error('❌ 本地音频播报失败:', error)
          this.isSpeaking = false
          this.audioSpeech = null
          // 降级到原生API
          this.speakWithNative(text, isInitial)
        }
        
        // 设置音频源
        this.audioSpeech.src = audioPath
        
        // 尝试播放
        const playPromise = this.audioSpeech.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('✅ 本地音频播放成功')
          }).catch(error => {
            console.error('❌ 本地音频播放失败:', error)
            // 降级到原生API
            this.speakWithNative(text, isInitial)
          })
        }
        
      } catch (error) {
        console.error('❌ 本地音频播报失败:', error)
        this.isSpeaking = false
        // 降级到原生API
        this.speakWithNative(text, isInitial)
      }
    },

    // 原生语音合成播报
    speakWithNative(text, isInitial = false) {
      try {
        // 确保之前的语音已停止
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel()
        }
        
        this.currentUtterance = new SpeechSynthesisUtterance(text)
        
        // 设置语音参数
        this.currentUtterance.lang = 'zh-CN'
        this.currentUtterance.rate = 1.0
        this.currentUtterance.pitch = 0.8
        this.currentUtterance.volume = 1.0
        
        // 尝试选择男声
        const voices = window.speechSynthesis.getVoices()
        const maleVoice = voices.find(voice => 
          voice.lang.includes('zh') && 
          (voice.name.includes('Male') || voice.name.includes('男') || voice.name.includes('Kangkang'))
        )
        if (maleVoice) {
          this.currentUtterance.voice = maleVoice
          console.log('🎤 使用男声:', maleVoice.name)
        }
        
        // 监听事件
        this.currentUtterance.onstart = () => {
          console.log('✅ 语音播报开始')
          this.isSpeaking = true
        }
        
        this.currentUtterance.onend = () => {
          console.log('✅ 语音播报结束')
          this.currentUtterance = null
          this.isSpeaking = false
          // 播报结束后播放背景音乐
          this.resumeBackgroundMusic(isInitial)
        }
        
        this.currentUtterance.onerror = (event) => {
          console.error('❌ 语音播报出错:', event.error)
          this.currentUtterance = null
          this.isSpeaking = false
          // 播报出错也要恢复背景音乐
          this.resumeBackgroundMusic(isInitial)
        }

        // 开始播报
        window.speechSynthesis.speak(this.currentUtterance)
        console.log('🔊 开始播报:', text.substring(0, 20) + '...')
        
      } catch (error) {
        console.error('❌ 语音播报失败:', error)
        this.isSpeaking = false
        // 播报失败也要恢复背景音乐
        this.resumeBackgroundMusic(isInitial)
      }
    },

    // 停止播报
    stopSpeaking() {
      console.log('🔇 停止播报')
      
      // 停止原生语音合成
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      
      // 停止音频播报
      if (this.audioSpeech) {
        this.audioSpeech.pause()
        this.audioSpeech.currentTime = 0
        this.audioSpeech = null
      }
      
      // 重置状态
      this.currentUtterance = null
      this.isSpeaking = false
      
      // 停止播报后恢复背景音乐
      this.resumeBackgroundMusic()
      
      console.log('🔇 已停止播报')
    },

    // 暂停背景音乐（播报开始时）
    pauseBackgroundMusic() {
      const bgMusic = this.$refs.backgroundMusic
      if (bgMusic && !bgMusic.paused) {
        bgMusic.pause()
        this.isBackgroundMusicPlaying = false
        console.log('🔇 播报开始，立即暂停背景音乐')
      }
    },

    // 恢复背景音乐（播报结束后）
    resumeBackgroundMusic(isInitial = false) {
      // 确保当前没有播报在进行
      if (this.isSpeaking) {
        console.log('🔇 当前仍在播报，不恢复背景音乐')
        return
      }

      const bgMusic = this.$refs.backgroundMusic
      if (bgMusic) {
        // 如果是初始播报结束，需要先初始化背景音乐
        if (isInitial) {
          console.log('🎵 初始播报结束，准备播放背景音乐')
          bgMusic.volume = this.backgroundVolume
          if (!bgMusic.src) {
            bgMusic.src = '/audio/bg-music.mp3'
          }
        }
        
        // 延迟一点时间确保播报完全结束
        setTimeout(() => {
          // 再次确认没有播报在进行
          if (!this.isSpeaking) {
            bgMusic.play().then(() => {
              this.isBackgroundMusicPlaying = true
              console.log('✅ 背景音乐开始播放（播报已结束）')
            }).catch(e => {
              console.log('背景音乐播放失败:', e.message)
              this.isBackgroundMusicPlaying = false
              
              // 如果是初始播报后的首次播放失败，添加用户交互监听器
              if (isInitial) {
                this.addUserInteractionListener()
              }
            })
          } else {
            console.log('🔇 检测到播报仍在进行，取消背景音乐播放')
          }
        }, 200) // 延迟200ms确保播报状态稳定
      }
    },

    // 停止背景音乐
    stopBackgroundMusic() {
      const bgMusic = this.$refs.backgroundMusic
      if (bgMusic && !bgMusic.paused) {
        bgMusic.pause()
        bgMusic.currentTime = 0
        this.isBackgroundMusicPlaying = false
        console.log('🔇 背景音乐已停止')
      }
    }
  }
}
</script>

<style scoped>
/* 基础容器样式 */
.home-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

/* 语音控制按钮 */
.speech-controls {
  position: fixed;
  top: 20%;
  right: 15px;
  z-index: 1000;
}

.speech-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.speech-btn:hover {
  background: rgba(76, 175, 80, 0.3);
  transform: scale(1.1);
}

.speech-btn.active {
  background: rgba(76, 175, 80, 0.4);
}

/* 幻灯片容器 */
.slideshow-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 幻灯片样式 */
.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  background-attachment: fixed;
}

.slide.active {
  opacity: 1;
}

/* 幻灯片覆盖层 */
.slide-overlay {
  display: none !important;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 幻灯片内容 */
.slide-content {
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slide-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slide-theme {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #ffd700;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.slide-description {
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 导航按钮 */
.nav-btn {
  position: fixed;
  top: 60%;
  transform: translateY(-50%);
  width: auto;
  height: auto;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  padding: 10px;
}

.nav-btn:hover {
  color: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.2);
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.nav-btn:active {
  transform: translateY(-50%) scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  color: rgba(255, 255, 255, 0.3);
}

.nav-btn:disabled:hover {
  transform: translateY(-50%) scale(1);
  color: rgba(255, 255, 255, 0.3);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 左箭头按钮 */
.nav-btn-prev {
  left: 30px;
  animation: float-left 3s ease-in-out infinite;
  background-image: url(../../assets/images/left.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 70%;
}

.nav-btn-prev::after {
}

@keyframes float-left {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(-5px);
  }
}

/* 右箭头按钮 */
.nav-btn-next {
  right: 30px;
  animation: float-right 3s ease-in-out infinite;
  background-image: url(../../assets/images/right.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 70%;
}

@keyframes float-right {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(5px);
  }
}

/* 悬停时加速动画 */
.nav-btn:hover {
  animation-duration: 1s;
}

/* 禁用状态停止动画 */
.nav-btn:disabled {
  animation: none;
}

/* 幻灯片指示器 */
.slide-indicators {
  display: none !important;
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 100;
}

.indicator {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.indicator.active {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.3);
}

/* 控制面板 */
.control-panel {
  display: none !important;
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 100;
}

.control-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.control-btn.active {
  background: rgba(255, 255, 255, 0.4);
}

.speech-btn {
  background: rgba(76, 175, 80, 0.2) !important;
}

.speech-btn:hover {
  background: rgba(76, 175, 80, 0.3) !important;
}

.speech-btn.active {
  background: rgba(76, 175, 80, 0.4) !important;
}

.slide-counter {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
}

/* 结尾页面样式 */
.ending-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/endbg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ending-content {
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ending-text h2 {
  margin-bottom: 30px;
}

.ending-text h2 img {
  max-width: 100%;
  height: auto;
}

.ending-text p {
  font-size: 1.5rem;
  line-height: 1.8;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.organizer {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 40px;
}

.back-btn {
  padding: 15px 40px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* 过渡动画 */
.ending-enter-active, .ending-leave-active {
  transition: all 0.8s ease;
}

.ending-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.ending-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .slide-title {
    font-size: 2.5rem;
  }
  
  .slide-theme {
    font-size: 1.4rem;
  }
  
  .slide-description {
    font-size: 1rem;
  }
  
  .slide-content {
    padding: 20px;
    max-width: 90%;
  }
  
  .nav-btn {
    width: 50px;
    height: 50px;
  }
  
  .nav-btn-prev {
    left: 15px;
  }
  
  .nav-btn-prev .arrow {
    border-right: 10px solid rgba(255, 255, 255, 0.9);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
  
  .nav-btn-next {
    right: 15px;
  }
  
  .nav-btn-next .arrow {
    border-left: 10px solid rgba(255, 255, 255, 0.9);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
  
  .control-panel {
    flex-direction: column;
    gap: 10px;
  }
  
  .control-btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
  
  .ending-content {
    padding: 30px;
    max-width: 90%;
  }
  
  .ending-text p {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .slide-title {
    font-size: 2rem;
  }
  
  .slide-theme {
    font-size: 1.2rem;
  }
  
  .slide-description {
    font-size: 0.9rem;
  }
  
  .audio-controls {
    top: 10px;
    right: 10px;
  }
  
  .audio-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>