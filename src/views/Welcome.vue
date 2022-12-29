<template>
  <v-stepper v-model="currentSlide" style="height:100vh;">
    <!--v-row class="ma-0 py-8">
        <v-row/>
        <img style="width:80px;" src="/logo.png"/>
        <v-row/>
    </v-row-->
    <v-stepper-items>
      <v-stepper-content step="1" style="height:calc(100vh - 160px);">

        <v-card-title>Bienvenido(a) <strong class="ml-2">{{currentUser.name}}</strong></v-card-title>

        <img style="width:100%;" src="/monita2.png"/>

        <v-card-title class="my-0 py-0 mt-2" style="font-weight: bold; font-size: 8vw;">Configura tu perfil</v-card-title>
        <v-card-title class="my-0 py-0 pt-3" style="font-weight: bold; font-size: 8vw;">para comenzar</v-card-title>

        <v-card-subtitle class="mt-4" style="color:grey!important; font-size: 20px;">Estas a solo unos pasos</v-card-subtitle>

      </v-stepper-content>

      <v-stepper-content step="2" style="height:calc(100vh - 160px);">

            <v-card-title class="px-0"><v-spacer/>Configura tu Contraseña<v-spacer/></v-card-title>

            <img style="width:100%; padding:50px;" class="mb-4" src="/password-monita.png"/>

            <v-text-field
                outlined style="border-radius:5px;" 
                dense
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
      </v-stepper-content>

      <v-stepper-content step="3" style="height:calc(100vh - 160px);">
        <v-card-title class="px-0"><v-spacer/>Ahora una foto para tu perfil<v-spacer/></v-card-title>
        <v-row class="ma-0 my-12">
            <v-spacer/>
                <v-badge bordered color="primary" icon="mdi-camera" overlap avatar offset-x="20" offset-y="150">
                    <v-avatar size="50vw" @click="$refs.image.$refs.input.click()">
                        <v-img alt="user" :src="currentUser.profile_photo_path"></v-img>
                    </v-avatar>
                </v-badge>
                <v-file-input
                    style="display:none!important;"
                    hide-input
                    ref="image"
                    accept="image/*"
                    v-model="imageData"
                ></v-file-input>
            <v-spacer/>
        </v-row>





        <v-list>
            <v-list-item style="font-size: 20px; font-weight: 500;">
                <v-spacer/>
                {{currentUser.name + ' ' + currentUser.last}}
                <v-spacer/>
            </v-list-item>
            <v-list-item style="font-size: 18px; font-weight: 400;">
                <v-spacer/>
                {{currentUser.email}}
                <v-spacer/>
            </v-list-item>
            <v-list-item v-if="currentUser.social_networks!=undefined&&currentUser.social_networks.instagram!=undefined">
                <v-spacer/>
                <v-list-item-icon class="mr-2">
                    <img style="width:21px;" src="/instagram.svg"/>
                </v-list-item-icon>
                <v-list-item-content>
                    {{currentUser.social_networks.instagram}}
                </v-list-item-content>
                <v-spacer/>
            </v-list-item>
            <v-list-item v-if="currentUser.social_networks!=undefined&&currentUser.social_networks.tiktok!=undefined">
                <v-spacer/>
                <v-list-item-icon class="mr-2">
                    <img style="width:21px;" src="/tiktok.svg"/>
                </v-list-item-icon>
                <v-list-item-content>
                    {{currentUser.social_networks.tiktok}}
                </v-list-item-content>
                <v-spacer/>
            </v-list-item>
        </v-list>



      </v-stepper-content>

    </v-stepper-items>
    <v-row class="ma-0 mb-4">
        <v-spacer/>
        <v-icon :color="iconColor(1)" x-small>mdi-record</v-icon>
        <v-icon :color="iconColor(2)" class="mx-2" x-small>mdi-record</v-icon>
        <v-icon :color="iconColor(3)" x-small>mdi-record</v-icon>
        <v-spacer/>
    </v-row>
    <v-row class="ma-0">
        <v-spacer/>
        <v-btn v-if="currentSlide<3" @click="currentSlide=currentSlide+1" class="px-12 py-6 peach-button" :disabled="!(this.min8(this.password1) === true && this.matchingPasswords() === true)&&currentSlide==2"><strong>Siguiente</strong></v-btn>
        <v-btn v-else @click="save()" class="px-12 py-6 peach-button"><strong>Guardar</strong></v-btn>
        <v-spacer/>
    </v-row>
    <v-row class="ma-0 mt-3" v-if="currentSlide>1">
        <v-spacer/>
        <v-btn @click="currentSlide=currentSlide-1" class="px-12 py-6" text><strong>Atras</strong></v-btn>
        <v-spacer/>
    </v-row>
  </v-stepper>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from "axios";
export default {
    components: {
        vueDropzone: vue2Dropzone,
    },
    data () {
      return {
        currentSlide: 1,
        show: false,
        show1: false,
        password:'',
        password1:'',
        successPass: false,
        successPass1: false,
        imageData:''
      }
    },
    watch:{
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
                })
            },deep:true,
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
        iconColor(slide){
            if(slide == this.currentSlide){
                return 'primary'
            }else{
                return 'grey'
            }
        },
        save(){
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users/" + this.currentUser.id,Object.assign(this.currentUser),{
                headers: {
                    'Authorization': "Bearer " + this.$route.query.t
                }
                }).then(response=>{
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/password", {'password':this.password},{
                headers: {
                    'Authorization': "Bearer " + this.$route.query.t
                }
                }).then(response=>{
                    window.location.replace("/");
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
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
.vue-dropzone {
    border: 2px solid #ffffff!important;
}
</style>