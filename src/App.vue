<template>
  <v-app>
    <app v-if="token!=null"></app>
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
  </v-app>
</template>

<script>
import update from './mixins/update'
import axios from "axios"
import App from "../src/views/App"
import Login from "../src/views/Login"
export default {
  mixins: [update],
  name: 'App',
  components:{ 
    'app':App, 
    'login':Login,
  },
  data: () => ({
    token:localStorage.getItem("session_token"),
  }),
  mounted(){
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").catch(error => {
      
      localStorage.removeItem("session_token");
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
