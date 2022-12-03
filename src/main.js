/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

axios.defaults.baseURL = import.meta.env.VITE_API_URL

app
    .use(router)
    .use(VueAxios, axios)
    .provide('axios', app.config.globalProperties.axios)  // provide 'axios'
    .mount('#app')