module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    // 关闭一些严格的规则，避免开发时的干扰
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'warn',
    'vue/no-unused-components': 'warn',
    'no-undef': 'off', // 关闭未定义变量检查，因为Vue 3的全局API
    'vue/no-v-model-argument': 'off',
    'vue/no-multiple-template-root': 'off'
  },
  globals: {
    // Vue 3 全局API
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}