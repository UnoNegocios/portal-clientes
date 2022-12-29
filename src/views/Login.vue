<template>
  <v-stepper v-model="currentSlide" style="background-color:#f4f5fa!important;">
      <v-stepper-items>
        <v-stepper-content step="login" class="pa-0">



          <v-container class="ma-0 pa-0" style="max-width: 100vw;  background:url('/background.png'); background-size: contain; font-family: Poppins!important;">

            <v-container class="fill-height pa-0" fluid style="min-height:100vh;">
              

                <v-card class="pa-0 mx-auto" style="width:90vw; background:transparent; box-shadow:none;">
                  <v-row style="margin:0; margin-bottom:50px;">
                    <img style="margin:auto;" height="80" src="/logo.png"/>
                  </v-row>
                  <v-card-title style="font-family: Oswald!important;" class="pl-0">Iniciar Sesión</v-card-title>
                  <div style="background:white;">
                    <v-alert  text dense type="error" v-if="error.show" style="font-size: 14px;"> 
                      <strong>Usuario</strong> y/o <strong>contraseña</strong> incorrecta(s)
                    </v-alert>
                  </div>

                  <v-card-text class="px-0 pb-0">
                    <v-form>
                      <v-text-field 
                      style="background:#f4f5fa;"
                      :rules="[rules.required, rules.email]"
                      @keydown.enter="login" 
                      label="Email" 
                      name="login" 
                      type="email" 
                      v-model="user.email" 
                      outlined></v-text-field>
                      <v-text-field 
                      style="background:#f4f5fa;"
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
                    <a @click="currentSlide='recover'">¿Olvidaste tu contraseña?</a>
                    <v-spacer/>
                  </v-row>
                </v-card>

                

            </v-container>
            
          </v-container>
        </v-stepper-content>
        <v-stepper-content step="recover" class="pa-0" style="background-color: black!important;">
          <v-container class="ma-0 pa-0" style="max-width: 100vw; background:url('/background.png'); background-size: contain; font-family: Poppins!important;">

            <v-container class="fill-height pa-0" fluid style="min-height:100vh;">
              

                <v-card dark class="pa-0 mx-auto" style="width:90vw; background:transparent; box-shadow:none;">
                  <v-row style="margin:0; margin-bottom:50px;">
                    <img style="margin:auto; filter:invert(1);" height="80" src="/logo.png"/>
                  </v-row>
                  <v-card-title style="font-family: Oswald!important;" class="pl-0">Recuperar Contraseña</v-card-title>

                  <v-alert  text dense :type="reset.type" v-if="reset.show" style="font-size: 14px;"> 
                    {{reset.message}}
                  </v-alert>


                  <v-card-text class="px-0 pb-0">
                    <v-form>
                      <v-text-field 
                      style="background:black;"
                      :rules="[rules.required, rules.email]"
                      @keydown.enter="login" 
                      label="Email" 
                      name="login" 
                      type="email" 
                      v-model="user.email" 
                      outlined></v-text-field>
                    </v-form>
                  </v-card-text>
                      
                  <v-card-actions class="pa-0">
                    <v-spacer></v-spacer>
                    <v-btn block type="submit" @click="recoverPassword" class="px-4 py-6 dark-peach-button"><strong>Recuperar</strong></v-btn>
                  </v-card-actions>

                  <v-row style="margin:0; margin-top:25px; margin-bottom:25px;">
                    <v-spacer/>
                    <a style="color:#cc82eb;" @click="currentSlide='login'">Iniciar Sesión</a>
                    <v-spacer/>
                  </v-row>
                </v-card>

                

            </v-container>

            
            
          </v-container>
        </v-stepper-content>
      </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  data:()=>({
    currentSlide:'login',
    alerta: false,
    show: false,
    show1: false,
    password: 'Password',
    rules: {
        required: value => !!value || 'Campo requerido.',
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
  computed:{
    error(){
      return this.$store.state.currentUser.error
    },
    reset(){
      return this.$store.state.currentUser.reset
    }
  },
  mounted(){
    if(this.currentSlide=='login'){
      document.documentElement.className = 'light-theme'
    }else{
      document.documentElement.className = 'dark-theme'
    }
  },
  methods:{
    login(){
      this.$store.dispatch('currentUser/loginUser', this.user);
    }, 
    recoverPassword(){
      this.$store.dispatch('currentUser/passwordReset', this.user);
    }
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
.dark-peach-button{
    box-shadow: 5px 5px 0px #cc82eb!important;
    border: solid 3px #cc82eb!important;
    border-radius: 5px;
    background: rgb(31, 31, 31)!important;
    color: white!important;
}
</style>