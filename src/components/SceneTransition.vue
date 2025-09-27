<template>
  <transition
    :name="transitionName"
    :mode="transitionMode"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'SceneTransition',
  props: {
    // 过渡类型：slide-up, slide-down, fade-scale, flip-3d, cube-rotate, wave-ripple
    type: {
      type: String,
      default: 'slide-up'
    },
    // 过渡持续时间（毫秒）
    duration: {
      type: Number,
      default: 800
    },
    // 过渡模式
    mode: {
      type: String,
      default: 'out-in'
    },
    // 是否启用粒子效果
    particles: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    transitionName() {
      return `scene-${this.type}`
    },
    transitionMode() {
      return this.mode
    }
  },
  methods: {
    beforeEnter(el) {
      this.$emit('before-enter', el)
      if (this.particles) {
        this.createParticleEffect(el)
      }
    },
    enter(el, done) {
      this.$emit('enter', el)
      // 设置动画持续时间
      el.style.animationDuration = `${this.duration}ms`
      el.style.transitionDuration = `${this.duration}ms`
      
      // 添加音效
      this.playTransitionSound()
      
      setTimeout(done, this.duration)
    },
    afterEnter(el) {
      this.$emit('after-enter', el)
      this.cleanupParticles(el)
    },
    beforeLeave(el) {
      this.$emit('before-leave', el)
    },
    leave(el, done) {
      this.$emit('leave', el)
      el.style.animationDuration = `${this.duration}ms`
      el.style.transitionDuration = `${this.duration}ms`
      setTimeout(done, this.duration)
    },
    afterLeave(el) {
      this.$emit('after-leave', el)
    },
    
    // 创建粒子效果
    createParticleEffect(el) {
      if (!this.particles) return
      
      const particleContainer = document.createElement('div')
      particleContainer.className = 'particle-container'
      el.appendChild(particleContainer)
      
      // 创建多个粒子
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 0.5 + 's'
        particleContainer.appendChild(particle)
      }
    },
    
    // 清理粒子效果
    cleanupParticles(el) {
      const particleContainer = el.querySelector('.particle-container')
      if (particleContainer) {
        setTimeout(() => {
          particleContainer.remove()
        }, 1000)
      }
    },
    
    // 播放过渡音效
    playTransitionSound() {
      try {
        const audio = new Audio('/audio/transition.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {
          // 忽略音频播放失败
        })
      } catch (error) {
        // 忽略音频创建失败
      }
    }
  }
}
</script>

<style scoped>
/* 基础过渡样式 */
.scene-slide-up-enter-active,
.scene-slide-up-leave-active {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.scene-slide-up-enter-from {
  transform: translateY(100vh) scale(0.8);
  opacity: 0;
}

.scene-slide-up-leave-to {
  transform: translateY(-100vh) scale(1.2);
  opacity: 0;
}

/* 淡入缩放效果 */
.scene-fade-scale-enter-active,
.scene-fade-scale-leave-active {
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.scene-fade-scale-enter-from {
  transform: scale(0) rotate(180deg);
  opacity: 0;
}

.scene-fade-scale-leave-to {
  transform: scale(2) rotate(-180deg);
  opacity: 0;
}

/* 3D翻转效果 */
.scene-flip-3d-enter-active,
.scene-flip-3d-leave-active {
  transition: all 0.8s ease-in-out;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.scene-flip-3d-enter-from {
  transform: rotateY(-90deg) translateZ(-200px);
  opacity: 0;
}

.scene-flip-3d-leave-to {
  transform: rotateY(90deg) translateZ(-200px);
  opacity: 0;
}

/* 立方体旋转效果 */
.scene-cube-rotate-enter-active,
.scene-cube-rotate-leave-active {
  transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.scene-cube-rotate-enter-from {
  transform: rotateX(-90deg) rotateY(-90deg) scale(0.5);
  opacity: 0;
}

.scene-cube-rotate-leave-to {
  transform: rotateX(90deg) rotateY(90deg) scale(0.5);
  opacity: 0;
}

/* 波浪涟漪效果 */
.scene-wave-ripple-enter-active,
.scene-wave-ripple-leave-active {
  transition: all 0.8s ease-out;
  position: relative;
  overflow: hidden;
}

.scene-wave-ripple-enter-from {
  transform: scale(0);
  opacity: 0;
  border-radius: 50%;
}

.scene-wave-ripple-leave-to {
  transform: scale(3);
  opacity: 0;
  border-radius: 50%;
}

.scene-wave-ripple-enter-active::before,
.scene-wave-ripple-leave-active::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 0.8s ease-out;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 200vw;
    height: 200vh;
    opacity: 0;
  }
}

/* 粒子效果 */
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #fff 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 2s ease-out forwards;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) scale(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-50vh) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) scale(0);
    opacity: 0;
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .scene-slide-up-enter-active,
  .scene-slide-up-leave-active,
  .scene-fade-scale-enter-active,
  .scene-fade-scale-leave-active,
  .scene-flip-3d-enter-active,
  .scene-flip-3d-leave-active,
  .scene-cube-rotate-enter-active,
  .scene-cube-rotate-leave-active,
  .scene-wave-ripple-enter-active,
  .scene-wave-ripple-leave-active {
    transition-duration: 0.6s;
  }
  
  .particle {
    width: 3px;
    height: 3px;
  }
}
</style>