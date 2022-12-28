<template>
  <v-app>
    <password-reset v-if="$route.query.password_reset!=undefined"></password-reset>
    <welcome v-else-if="$route.query.t!=undefined"></welcome>
    <app v-else-if="token!=null"></app>
    <login v-else></login>
    <v-dialog top color="primary" timeout="999999999" :value="updateExists" persistent><!-- :value="updateExists" -->
      <v-card class="py-4">
        <v-row class="ma-0">
          <v-spacer/>
          <span style="font-size:16px;">Hay una actualización disponible!</span>
          <v-spacer/>
        </v-row>
        <v-row class="ma-0 mt-4">
          <v-spacer/>
          <v-btn class="ml-4 elevation-0" small style="margin-top:-4px;" color="primary" @click="refreshApp">
            Actualizar
          </v-btn>
          <v-spacer/>
        </v-row>
      </v-card>
    </v-dialog>
    <!--v-snackbar top color="primary" timeout="999999999" :value="updateExists" content-class="py-2">
      <v-row class="ma-0">
        <v-spacer/>
        <span style="font-size:16px;">Hay una actualización disponible!</span>
        <v-spacer/>
      </v-row>
      <v-row class="ma-0 mt-2">
        <v-spacer/>
        <v-btn class="ml-4 elevation-0" small style="margin-top:-4px;" color="white" light @click="refreshApp">
          Actualizar
        </v-btn>
        <v-spacer/>
      </v-row>
    </v-snackbar-->
    <v-snackbar color="success" v-model="password_reset" bottom style="margin-bottom:30px;">
      Contraseña restaurada con éxito
    </v-snackbar>
  </v-app>
</template>

<script>
import update from './mixins/update'
import axios from "axios"
import App from "../src/views/App"
import Login from "../src/views/Login"
import Welcome from "../src/views/Welcome"
import confetti from "canvas-confetti"
import PasswordReset from "../src/views/PasswordReset"

export default {
  mixins: [update],
  name: 'App',
  components:{ 
    'app':App, 
    'login':Login,
    'welcome':Welcome,
    'password-reset':PasswordReset
  },
  data: () => ({
    token:localStorage.getItem("session_token"),
  }),
  methods:{
    frame() {
      confetti({
        particleCount: 5,
        angle: 90,
        spread: 35,
        origin: { y: 1 },
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
      });
      if (this.show_confetti) {
        setTimeout(() => {
          this.frame()
        }, 50);
      }
    }
  },
  computed:{
    password_reset(){
      return localStorage.getItem("password_reset");
    },
    firstLogin(){
      return localStorage.getItem("first_login")
    },
  },
  created(){
    setTimeout(() => {
      localStorage.removeItem("password_reset")
    }, 2000);
    if(this.$route.query.user!=undefined&&this.$route.query.expires!=undefined&&this.$route.query.signature){
      axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/password_reset?expires=" + this.$route.query.expires + '&user=' + this.$route.query.user + '&signature=' + this.$route.query.signature).then(response => {
        localStorage.setItem("session_token", response.data);
        window.location.replace('/?t=' + response.data + '&password_reset=true');
      });
    }
    if(this.$route.query.t!=undefined && this.$route.query.password_reset==undefined){
      localStorage.setItem("session_token", this.$route.query.t);
      localStorage.setItem("first_login", true);
    }
    else if(localStorage.getItem("first_login") && this.$route.fullPath == '/'){
      this.show_confetti = true
      this.frame()
      setTimeout(() => {
        this.show_confetti = false
        localStorage.removeItem("first_login")
      }, 2000);
    }
  },
  mounted(){
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").catch(error => {
      //localStorage.removeItem("session_token");
      this.token = null
    });
  },
};
</script>

<style>
.v-application {
    font-family: Poppins!important;
}
</style>
