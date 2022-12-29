<template>
    <v-container class="pa-0">
        <v-row class="ma-0 py-2 px-2">
            <v-btn to='/' icon><v-icon>mdi-chevron-left</v-icon></v-btn>
            <v-spacer/>
            <v-btn @click="save()" :disabled="disabled_button" :loading="loader_button" color="primary" class="mt-1" small text>guardar</v-btn>
        </v-row>
        <v-row class="ma-0 my-12">
            <v-spacer/>
                    <a @click="$refs.image.$refs.input.click()">
                        <v-badge bordered color="primary" icon="mdi-camera" overlap avatar offset-x="20" offset-y="90">
                            <v-avatar size="100px">
                                <v-img alt="user" :src="currentUser.profile_photo_path"></v-img>
                            </v-avatar>
                        </v-badge>
                    </a>
                    <v-file-input
                        style="display:none!important;"
                        hide-input
                        ref="image"
                        accept="image/*"
                        v-model="imageData"
                    ></v-file-input>
            <v-spacer/>
        </v-row>
        <div class="mt-12 pt-12 px-8" style="text-align:center; height:calc(100vh - 280px)!important; background:white; border-radius: 10px 10px 0px 0px; box-shadow: 0px 10px 20px 10px #00000018!important;">
            <v-text-field v-model="currentUser.name" label="Nombre" outlined style="border-radius:5px;" dense></v-text-field>
            <v-text-field v-model="currentUser.last" label="Apellido" outlined style="border-radius:5px;" dense></v-text-field>
            <v-text-field v-model="currentUser.email" label="Email" outlined style="border-radius:5px;" dense></v-text-field>
            <v-text-field v-model="currentUser.phone" label="Teléfono" outlined style="border-radius:5px;" dense></v-text-field>
            <v-row class="my-1">
                <v-spacer/>
                <v-dialog v-model="dialog2" width="325">
                    <template v-slot:activator="{ on, attrs }" v-if="!editPassword">
                        <a v-bind="attrs" v-on="on">Cambiar contraseña</a>
                    </template>
                    <v-card class="pa-6">
                        <v-card-title class="px-0 mb-2">Cambiar Contraseña</v-card-title>

                        <v-text-field
                             outlined style="border-radius:5px;" dense
                            :type="show ? 'text' : 'password'"
                            v-model="password"
                            label="Contraseña"
                            :rules="[required, min8]"
                            :counter="8">
                            <template v-slot:append>
                                <v-icon class="mt-1" small @click="show = !show" v-if="show">mdi-eye</v-icon>
                                <v-icon class="mt-1" small @click="show = !show" v-if="!show">mdi-eye-off</v-icon>
                            </template>
                        </v-text-field>
                        <!-- password1 -->
                        <v-text-field
                             outlined style="border-radius:5px;" dense
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
                            <v-btn type="submit" @click="savePassword()" class="py-3 peach-button" :disabled="!(this.min8(this.password1) === true && this.matchingPasswords() === true)"><strong>Guardar</strong></v-btn>
                        </v-row>    
                    </v-card>
                </v-dialog>
                <v-spacer/>
            </v-row>
            <v-btn @click="logout()" bottom absolute style="margin-bottom:90px; margin-left:calc(50vw - 100px); color:grey;" left class="elevation-0" color="white">
                <v-icon>mdi-exit-to-app</v-icon>
                Cerrar Sesión
            </v-btn>
        </div>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show" bottom style="margin-bottom:100px;">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data(){
        return{
            loader_button:false,
            disabled_button:true,
            imageData:'',
            fileName:'',
            show: false,
            show1: false,
            dialog2:false,
            editPassword:false,
            password:'',
            password1:'',
            successPass: false,
            successPass1: false,
            snackbar: {
                show: false,
                message: null,
                color: null
            },
        }
    },
    computed:{
        currentUser(){
            var user = this.$store.state.currentUser.user
            this.original_user = user
            return user
        },
    },
    watch:{
        currentUser:{
            handler(){
                this.disabled_button = false
            },deep: true
        },
        imageData:{
            handler(){     
                let formData = new FormData();
                formData.append('image', this.imageData);
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/photo"
                    ,formData
                    ,{headers: {"Content-Type": "multipart/form-data"}}
                ).then(response=>{
                    console.log(response)
                    this.currentUser.profile_photo_path = 'https://unopack.mx/files/thumbnail/' + response.data
                    this.$nextTick(() => {this.save()})
                })
            },deep:true,
        }
    },
    methods:{
        logout(){
            this.$store.dispatch('currentUser/logoutUser')
        },
        save(){
            this.loader_button = true
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users/" + this.currentUser.id,Object.assign(this.currentUser)).then(response=>{
                this.disabled_button = true
                this.loader_button = false
                this.snackbar = {
                    message: 'Cambio realizado con éxito',
                    color: 'success',
                    show: true
                }
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        },
        savePassword(){
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/password", {'password':this.password}).then(response=>{
                this.dialog2 = false
                this.editPassword=false
                this.snackbar = {
                    message: 'Cambio realizado con éxito',
                    color: 'success',
                    show: true
                }
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
.peach-button{
    box-shadow: 5px 5px 0px black!important;
    border: solid 3px black!important;
    border-radius: 5px;
    background: #cc82eb!important;
    color: black!important;
}
.dropzone .dz-preview {
    max-width: 68vw!important;
}
</style>