<template>
    <v-container step="2" style="height:100vh; max-width: 100vw; background-size: contain; font-family: Poppins!important;">

        <v-card-title class="px-0 mb-12"><v-spacer/>Recuperar Contrseña<v-spacer/></v-card-title>

        <img style="width:100%; padding:50px 100px;" class="mb-4" src="https://masterfrut.com/wp-content/uploads/2021/07/MASTERFRUT.svg"/>

        <v-row class="ma-0 mb-6">
            <v-spacer/>
            <strong>{{currentUser.email}}</strong>
            <v-spacer/>
        </v-row>

        <v-text-field
            outlined style="border-radius:5px; background:white;"
            dense
            :type="show ? 'text' : 'password'"
            v-model="password"
            label="Nueva Contraseña"
            :rules="[required, min8]"
            :counter="8">
            <template v-slot:append>
                <v-icon class="mt-1" small @click="show = !show" v-if="show">mdi-eye</v-icon>
                <v-icon class="mt-1" small @click="show = !show" v-if="!show">mdi-eye-off</v-icon>
            </template>
        </v-text-field>
        <!-- password1 -->
        <v-text-field
            outlined style="border-radius:5px; background:white;" dense
            :type="show1 ? 'text' : 'password'"
            v-model="password1"
            label="Verificar Contraseña"
            :rules="[required, min8, matchingPasswords ]"
            :counter="8">
            <template v-slot:append>
                <v-icon class="mt-1" small @click="show1 = !show1" v-if="show1">mdi-eye</v-icon>
                <v-icon class="mt-1" small @click="show1 = !show1" v-if="!show1">mdi-eye-off</v-icon>
            </template>
        </v-text-field>

        <v-row class="ma-0 mt-6">
            <v-spacer/>
            <v-btn @click="save()" class="px-12 py-6" rounded color="#5d267b" dark><strong>Guardar</strong></v-btn>
            <v-spacer/>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios"
export default {
    data () {
      return {
        show: false,
        show1: false,
        password:'',
        password1:'',
        successPass: false,
        successPass1: false,
      }
    },
    computed:{
        currentUser(){
            return this.$store.state.currentUser.user
        }
    },
    created(){
        this.$store.dispatch('currentUser/getUser')
    },
    methods:{
        save(){
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/user/password", {'password':this.password},{
                headers: {
                    'Authorization': "Bearer " + this.$route.query.t
                }
                }).then(response=>{
                localStorage.setItem("password_reset", true);
                window.location.replace("/");
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        },
        required: function(value) {
            if (value) {
                return true;
            } else {
                return 'Este campo es obligatorio.';
            }
        },
        min8: function(value) {
            if (value.length >= 8) {
                return true;
            } else {
                return 'La contraseña debe tener más de 8 caracteres.';
            }
        },
        matchingPasswords: function() {
            if (this.password === this.password1) {
                return true;
            } else {
                return 'Las contraseñas no coinciden.';
            }
        },
    }
}
</script>

<style>

</style>