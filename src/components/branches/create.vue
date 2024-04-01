<template>
    <v-card class="cretae_client">
        <v-card-title class="pb-0 pt-3 pb-2" >
            <span v-if="liga == 'https://backendmf.unocrm.mx/'">Nuevo Comedor</span>
            <span v-else>Nueva Sucursal</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-4">
            <v-text-field outlined :rules="[v => !!v || 'Campo requerido']" v-model="branch.name" label="Nombre Sucursal"></v-text-field>
            <v-text-field outlined :rules="[v => !!v || 'Campo requerido']" v-model="branch.email" label="Correo Electrónico"></v-text-field>
            <v-text-field outlined :rules="[v => !!v || 'Campo requerido']" v-model="branch.address" label="Dirección"></v-text-field>
        </v-card-text>
        <v-card-actions class="pr-6 pb-6">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-2" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="primary" class="px-3" @click="save" :loading="gris" :disabled="gris || grey">
                Guardar
            </v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from "axios";
    export default {
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
            branch:{
                name:'',
                address:'',
                email:'',
                additional_data:'',
                company_id:''
            }
        }),
        computed: {
            grey(){
                if(this.branch.name==''||this.branch.name==null||this.branch.name==undefined
                ||this.branch.address==''||this.branch.address==null||this.branch.address==undefined){
                    return true
                }else{
                    return false
                }
            },
        },
        methods: {
            close () {
                this.gris = false
                const branch = this.branch
                this.branch = {
                    name:'',
                    address:'',
                    email:'',
                    additional_data:'',
                    company_id:''
                }
                this.$nextTick(() => {
                    this.$emit("closeCreateDialogBranch", branch);
                })
            },
            save () {
                this.gris = true
                this.branch.company_id = this.$route.params.id
                this.$nextTick(() => {
                    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/company_branches",Object.assign(this.branch)).then(response=>{
                        this.close(response.data)
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                        this.gris = false
                    })
                })
                
            },
        },
    }
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
</style>
<style>
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
.cretae_client .v-text-field__details{
    display: none !important;
}
</style>