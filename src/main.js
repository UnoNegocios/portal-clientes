import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios"
import Echo from "laravel-echo";

Vue.config.productionTip = false

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("session_token");
axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420'

Vue.component('apexchart', VueApexCharts)

window.Pusher = require('pusher-js');

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_WEBSOCKETS_KEY,
  wsHost: process.env.VUE_APP_WEBSOCKETS_SERVER,
  wsPort:6001,
  forceTLS: false,
  disableStats: true
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
