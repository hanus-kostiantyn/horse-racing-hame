import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { store } from '@/app/providers/store'

const app = createApp(App)

// Use Vuex store
app.use(store)

if (import.meta.env.DEV) {
  app.config.performance = true
  window.__VUE_APP__ = app
  window.__VUEX_STORE__ = store
}

app.mount('#app')
