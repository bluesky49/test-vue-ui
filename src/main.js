import { createApp } from 'vue'
import { clientStore } from "./stores/clients"
import App from './App.vue'

import './assets/base.css'

const app = createApp(App)

app.use(clientStore)

app.mount('#app')