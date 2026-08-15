import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initTheme } from './composables/useTheme'

import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/styles/element.scss'
import '@/assets/styles/global.scss'

initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
