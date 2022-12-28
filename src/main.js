import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios"

Vue.config.productionTip = false

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("session_token");

Vue.component('apexchart', VueApexCharts)



new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
