import axios from "axios";
const state = {
  user: {},
  error:{
    show:false,
    message:''
  },
  reset:{
    show:false,
    message:'',
    type:''
  },
};
const getters = {};
const actions = {
  getUser({ commit }) {
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current", 
    
    ).then(response => {
      commit("setUser", response.data.data);
    });
  },
  loginUser({state}, user) {
    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/login", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("session_token", response.data.access_token);
          window.location.replace("/");
          location.reload();
        }else{
          state.error = {show: true, message: response.data.message}
        }
      }).catch(error=>{
        console.log(error)
        state.error = {show: true, message: error.response.data.message}
      })
  },
  passwordReset({state}, user) {
    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/login/reset-password", {
        email: user.email
      })
      .then(response => {
        console.log(response)
        state.reset = {show: true, message: 'Si existe una cuenta con este correo te llegara información con instrucciones a tu bandeja', type:'success'}
      }).catch(error=>{
        console.log(error)
        state.reset = {show: true, message: 'Si existe una cuenta con este correo te llegara información con instrucciones a tu bandeja', type:'success'}
      })
  },
  logoutUser() {
    localStorage.clear();
    window.location.replace("/");
    location.reload();
  }
};
const mutations = {
  setUser(state, data) {
    state.user = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
