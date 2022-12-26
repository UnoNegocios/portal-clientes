<template>
    <v-container class="pa-0">
        <v-row class="ma-0 py-2 px-2">
            <v-btn icon><v-icon>mdi-chevron-left</v-icon></v-btn>
            <v-spacer/>
            <v-btn @click="save()" color="primary" class="mt-1" small text>guardar</v-btn>
        </v-row>
        <v-row class="ma-0 my-12">
            <v-spacer/>
            <v-dialog v-model="dialog" width="325">
                <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                        <v-badge bordered color="primary" icon="mdi-camera" overlap avatar offset-x="20" offset-y="90">
                            <v-avatar size="100px">
                                <v-img alt="user" :src="currentUser.profile_photo_url"></v-img>
                            </v-avatar>
                        </v-badge>
                    </div>
                </template>
                <v-card>
                    <vue-dropzone 
                        ref="myVueDropzone" 
                        id="dropzone" 
                        :options="dropzoneOptions" 
                        v-on:vdropzone-success="uploadSuccess" 
                        v-on:vdropzone-error="uploadError" 
                        v-on:vdropzone-removed-file="fileRemoved"/>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="save()">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
                <v-snackbar :color="snackbar.color" v-model="snackbar.show">
                    {{ snackbar.message }}
                </v-snackbar>
            </v-dialog>
            <v-spacer/>
        </v-row>
        <div class="mt-12 pt-12 px-8" style="text-align:center; height:calc(100vh - 232px)!important; background:white; border-radius: 10px 10px 0px 0px; box-shadow: 0px 10px 20px 10px #00000018!important;">
            <v-text-field v-model="currentUser.name" label="Nombre" outlined style="border-radius:5px;" dense></v-text-field>
            <v-text-field v-model="currentUser.last" label="Apellido" outlined style="border-radius:5px;" dense></v-text-field>
            <v-text-field v-model="currentUser.email" label="Email" outlined style="border-radius:5px;" dense></v-text-field>
            <v-text-field v-model="currentUser.phone" label="Teléfono" outlined style="border-radius:5px;" dense></v-text-field>
            <v-row class="my-1" v-if="!editPassword">
                <v-spacer/>
                <v-dialog v-model="dialog2" width="325">
                    <template v-slot:activator="{ on, attrs }">
                        <a v-bind="attrs" v-on="on">Cambiar contraseña</a>
                    </template>
                    <v-card class="pa-6">
                        <v-card-title class="px-0 mb-2">Cambiar Contraseña</v-card-title>
                        <v-text-field v-model="password" label="Nueva Contraseña" outlined style="border-radius:5px;" dense placeholder="Contraseña"></v-text-field>
                        <v-row class="ma-0">
                            <v-spacer/>
                            <v-btn type="submit" @click="savePassword()" class="py-3 peach-button"><strong>Guardar</strong></v-btn>
                        </v-row>    
                    </v-card>
                </v-dialog>
                <v-spacer/>
            </v-row>
            <v-btn bottom fixed style="margin-bottom:90px; margin-left:calc(50vw - 100px); color:grey;" left class="elevation-0" color="white">
                <v-icon>mdi-exit-to-app</v-icon>
                Cerrar Sesión
            </v-btn>
        </div>
    </v-container>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from "axios";
export default {
    components: {
        vueDropzone: vue2Dropzone,
    },  
    data(){
        return{
            dialog:false,
            dialog2:false,
            dropzoneOptions: {
                url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/photo",
                addRemoveLinks: true,
                maxFiles: 1,
                thumbnailWidth: 250,
                dictDefaultMessage: 'Haz clic aquí o arrastra una imagen.',
                dictFallbackMessage: "Tu navegador no puede subir archivos arrastarndolos a la pantalla.",
                dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                dictInvalidFileType: "No puede cargar archivos de este tipo.",
                dictCancelUpload: "Cancelar carga",
                dictCancelUploadConfirmation: "Estás seguro de que deseas cancelar esta carga?",
                dictRemoveFile: "Eliminar",
                dictMaxFilesExceeded: "No puedes subir más archivos.",
            },
            editPassword:false,
            password:'',
            snackbar: {
                show: false,
                message: null,
                color: null
            },
        }
    },
    computed:{
        currentUser(){
            return this.$store.state.currentUser.user
        },
    },
    methods:{
        save(){
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/" + this.currentUser.id,Object.assign(this.currentUser)).then(response=>{
                this.$store.dispatch('currentUser/getUser')
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

        uploadSuccess(file, response) {
            console.log('File Successfully Uploaded with file name: ' + response.file);
            this.fileName = response.file
            this.currentUser.avatar = this.fileName
            this.index = this.index+1
        },
        uploadError(file, message) {
            this.snackbar2 = {
                message: message.message,
                color: 'error',
                show: true
            }
        },
        fileRemoved(file) {
            this.currentUser.avatar = ''
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