import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import contact_mode from "./modules/contact_mode"
import payment_method from "./modules/payment_method"
import cfdi from "./modules/cfdi"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    currentUser,
    contact_mode,
    payment_method,
    cfdi
  }
})
