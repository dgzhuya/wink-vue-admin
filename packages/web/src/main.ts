import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import permission from './directives/permission'
import '@web/style/index.scss'
import '@web/plugin/svg-icons/virtual'
import './permission'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(permission)
app.mount('#app')
