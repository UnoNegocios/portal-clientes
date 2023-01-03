import axios from "axios";
import router from '../../router';
const state = {
  user: '',
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
    if(router.history.current.query.t!=undefined){
      var token = "Bearer " + router.history.current.query.t
    }
    else if(localStorage.getItem("session_token")!=undefined){
      var token = "Bearer " + localStorage.getItem("session_token");
    }
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current", 
    {
      headers: {
        'Authorization': token
      }
    }
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
          //location.reload();
        }else{
          state.error = {show: true, message: response.data.message}
        }
      }).catch(error=>{
        state.error = {show: true, message: error.response.data.message}
      })
  },
  passwordReset({state}, user) {
    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/login/reset-password", {
        email: user.email
      })
      .then(response => {
        state.reset = {show: true, message: 'Si existe una cuenta con este correo te llegara información con instrucciones a tu bandeja', type:'success'}
      }).catch(error=>{
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
