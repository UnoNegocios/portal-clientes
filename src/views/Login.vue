<template>
  <v-container class="ma-0 pa-0" style="max-width: 100vw; background:url('/background.png'); background-size: contain; font-family: Poppins!important;">

    <v-container class="fill-height pa-0" fluid style="min-height:100vh;">
      

        <v-card class="pa-0 mx-auto" style="width:90vw; background:transparent; box-shadow:none;">
          <v-row style="margin:0; margin-bottom:50px;">
            <img style="margin:auto;" height="80" src="/logo.png"/>
          </v-row>
          <v-card-title style="font-family: Oswald!important;">Accede a tu cuenta</v-card-title>
          <v-card-text class="px-0 pb-0">
            <v-form>
              <v-text-field 
              style="background:white;"
              :rules="[rules.required, rules.email]"
              @keydown.enter="login" 
              label="Email" 
              name="login" 
              type="email" 
              v-model="user.email" 
              outlined></v-text-field>
              <v-text-field 
              style="background:white;"
              :rules="[rules.required]"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              name="password"
              label="Contraseña"
              @click:append="show1 = !show1"
              @keydown.enter="login" 
              v-model="user.password" 
              outlined></v-text-field>
            </v-form>
          </v-card-text>
              
          <v-card-actions class="pa-0">
            <v-spacer></v-spacer>
            <v-btn block type="submit" @click="login" class="px-4 py-6 peach-button"><strong>Acceder</strong></v-btn>
          </v-card-actions>

          <v-row style="margin:0; margin-top:25px; margin-bottom:25px;">
            <v-spacer/>
            <a>¿Olvidaste tu contraseña?</a>
            <v-spacer/>
          </v-row>
        </v-card>

    </v-container>
    
  </v-container>
</template>

<script>
export default {
  data:()=>({
    alerta: false,
    show: false,
    show1: false,
    password: 'Password',
    rules: {
        required: value => !!value || 'Contraseña requerida.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'E-mail inavlido.'
        }
    },
    user:{
        email: "",
        password: "",
    }
  }),
  methods:{
    login(){
      this.$store.dispatch('currentUser/loginUser', this.user );
      this.alerta = localStorage.getItem("nosepudo")
    }, 
  }
}
</script>
<style>
.peach-button{
    box-shadow: 5px 5px 0px black!important;
    border: solid 3px black!important;
    border-radius: 5px;
    background: #cc82eb!important;
    color: black!important;
}
</style>