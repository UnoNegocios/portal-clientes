import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import collab from "./modules/collab"

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
    collab
  }
})
