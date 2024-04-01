<template>
    <v-container v-if="client!=undefined" class="mb-12 pb-12">
        <v-card-title class="">
            Datos de Cliente
        </v-card-title>
        <v-row class="ma-0">
            <v-card v-if="client.credit_days!=undefined">
                <v-card-title>Días de Crédito</v-card-title>
                <v-card-subtitle>{{client.credit_days}}</v-card-subtitle>
            </v-card>
            <v-card v-if="client.credit_limit!=undefined">
                <v-card-title>Limite de Crédito</v-card-title>
                <v-card-subtitle>{{client.credit_limit}}</v-card-subtitle>
            </v-card>
        </v-row>
        <v-row class="ma-0">
            <v-col cols="6">
                <v-text-field outlined prepend-inner-icon="mdi-domain" v-model="client.name" label="Nombre de Empresa*"></v-text-field>
                <v-text-field outlined type="number" v-model="client.phone" label="Teléfono"></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field outlined v-model="client.contact_mode" label="Medio de Contacto Preferido"></v-text-field>
                <v-text-field outlined prepend-inner-icon="mdi-email" v-model="client.email" label="Correo Electrónico"></v-text-field>
            </v-col>
        </v-row>
        <v-card-text class="py-4 ma-0 pa-0" style="border-bottom:solid 1px grey;">
            <v-row class="ma-0">
                <strong>Datos Fiscales</strong>
                <v-spacer/>
                <v-icon style="margin-top:5px;" v-if="!show_df" @click="show_df=!show_df">mdi-chevron-down</v-icon>
                <v-icon style="margin-top:5px;" v-if="show_df" @click="show_df=!show_df">mdi-chevron-up</v-icon>
            </v-row>
            <v-container class="pa-0 ma-0" v-if="show_df">
                <v-text-field v-model="client.razon_social" :error="nosa" hint="sin el régimen societario (ej.: S.A. de C.V.)." persistent-hint dense class="mt-3 mb-0 mx-3" label="Razón Social*" outlined></v-text-field>
                <v-row class="ma-0 mt-3">
                    <v-col cols="6" class="my-0 py-0">
                        <v-text-field v-model="client.rfc" dense label="RFC*" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_email" dense label="Email" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6" class="my-0 py-0">
                        <v-autocomplete v-model="client.tax_system" dense label="Régimen Fiscal*" outlined :items="tax_systems" item-text="name" item-value="id"></v-autocomplete>
                    </v-col>
                    <v-col cols="6" class="my-0 py-0">
                        <v-autocomplete outlined dense clearable v-model="client.cfdi_use" :items="cfdiLists" label="Uso de CFDI" item-text="Descripción" item-value="Clave">
                            <template slot="no-data">No existen usos relacionados.</template>                      
                        </v-autocomplete>
                    </v-col>
                </v-row>
                    <v-row class="ma-0" v-if="client.fiscal_address_json!=undefined?true:client.fiscal_address_json=fiscal_address_json">
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_address_json.street" dense label="Calle" outlined></v-text-field>
                    </v-col>
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_address_json.exterior" dense label="# Exterior" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_address_json.interior" dense label="# Interior" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_address_json.neighborhood" dense label="Colonia" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_address_json.city" dense label="Ciudad" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_address_json.municipality" dense label="Municipio" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_address_json.zip" dense label="Código Postal*" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field v-model="client.fiscal_address_json.state" dense label="Estado" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="my-0 py-0">
                        <v-text-field class="mb-2" v-model="client.fiscal_address_json.country" hint="Código de país acorde al estándar ISO 3166-1 alpha-3" persistent-hint dense label="Código de País" outlined></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-text class="py-4 ma-0 pa-0" style="border-bottom:solid 1px grey;">
            <v-row class="ma-0">
                <strong>Datos Bancarios</strong>
                <v-spacer/>
                <v-icon style="margin-top:5px;" v-if="!show_db" @click="show_db=!show_db">mdi-chevron-down</v-icon>
                <v-icon style="margin-top:5px;" v-if="show_db" @click="show_db=!show_db">mdi-chevron-up</v-icon>
            </v-row>
            <v-row class="pa-0 ma-0" v-if="show_db">
                <v-col cols="6">
                    <v-text-field outlined class="mt-2" dense v-model="client.bank_account_number" label="Numero de Cuenta"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-autocomplete outlined class="mt-2" dense clearable v-model="client.payment_method_id" :items="methodLists" label="Método de Pago" item-text="method" item-value="id">
                        <template slot="no-data" class="pa-2">No existen metodos relacionados.</template>                      
                    </v-autocomplete>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text class="py-4 ma-0 pa-0" style="border-bottom:solid 1px grey;">
            <v-row class="ma-0">
                <strong>Sucursales</strong>
                <v-spacer/>
                <v-icon style="margin-top:5px;" v-if="!show_s" @click="show_s=!show_s">mdi-chevron-down</v-icon>
                <v-icon style="margin-top:5px;" v-if="show_s" @click="show_s=!show_s">mdi-chevron-up</v-icon>
            </v-row>
            <v-container class="pa-0 ma-0 mt-2" v-if="show_s" style="display:flex;">
                <v-card v-for="(b, index) in client.company_branches" :key="index" class="py-2 px-4 mr-3" style="width:50%;">
                    <v-row class="ma-0">
                        <strong>{{b.name}}</strong> 
                        <v-spacer/>
                        <v-icon @click="editBranch(b)" x-small>mdi-pencil</v-icon>
                    </v-row>
                    <span style="font-size:12px;">
                        <v-icon x-small>mdi-google-maps</v-icon>{{b.address}}
                    </span>
                </v-card>
            </v-container>
        </v-card-text>
        <v-card-text class="py-4 ma-0 pa-0" style="border-bottom:solid 1px grey;">
            <v-row class="ma-0">
                <strong>Contactos</strong>
                <v-spacer/>
                <v-icon style="margin-top:5px;" v-if="!show_c" @click="show_c=!show_c">mdi-chevron-down</v-icon>
                <v-icon style="margin-top:5px;" v-if="show_c" @click="show_c=!show_c">mdi-chevron-up</v-icon>
            </v-row>
            <v-container class="pa-0 ma-0 mt-2" v-if="show_c" style="display:flex;">
                <v-card style="width:50%;" class="mx-2" v-for="(contact,c) in client.contacts" :key="c">
                    <v-list>
                        <v-list-item>
                            <v-list-item-avatar>
                                <img :src="liga + 'files/default.jpg'">
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{contact.name}} {{contact.last}}
                                    <v-chip v-if="!contact.is_active" class="ml-2" color="red" x-small dark>Inactivo</v-chip>
                                    <v-chip v-if="contact.is_active" class="ml-2" color="success" x-small dark>Activo</v-chip>
                                </v-list-item-title>
                                <v-list-item-subtitle>{{contact.job_position}}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <div>
                                    <v-btn icon class="mr-4" @click="deleteContact(contact.id)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                    <v-btn icon @click="editContact(contact.id)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </div>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-row class="pa-4">
                        <v-col cols="12" md="5">
                            <span @click="whatsapp(contact.phone)" style="font-size:14px; color:#1f88fe; cursor: pointer;"><v-icon small color="#1f88fe" class="mr-2">mdi-phone</v-icon>{{contact.phone}}</span>
                        </v-col>
                        <v-col cols="12" md="7">
                            <span v-bind:href="'mailto:'+contact.email" style="font-size:14px; color:#1f88fe; cursor: pointer;"><v-icon small color="#1f88fe" class="mr-2">mdi-email</v-icon>{{contact.email}}</span>
                        </v-col> 
                    </v-row>
                </v-card>
            </v-container>
        </v-card-text>
        <v-row class="ma-0 mb-12">
            <v-spacer/>
            <v-btn color="#5d267b" dark class="elevation-0" block>Guardar</v-btn>
            <v-spacer/>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios"
import fiscal_catalogs from '../mixins/fiscal_catalogs'
import createContact from '../components/contacts/create.vue'
import editContact from '../components/contacts/edit.vue'
import createBranch from '../components/branches/create.vue'
import editBranch from '../components/branches/edit.vue'
export default {
    mixins: [fiscal_catalogs],
    components:{
        createContact,
        editContact,
        createBranch,
        editBranch
    },
    data(){
        return{
            show_df:false,
            show_db:false,
            show_s:false,
            show_c:false,
            client:undefined,
            loader: true,
            fiscal_address_json:{
                street:'',
                exterior:'',
                interior:'',
                neighborhood:'',
                city:'',
                municipality:'',
                zip:'',
                state:'',
                country:'MEX'
            }
        }
    },
    computed:{
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        cfdiLists(){
            return this.$store.state.cfdi.uses;
        },
        methodLists(){
            return this.$store.state.payment_method.payment_methods;
        },
        nosa(){
            if(this.client.razon_social!=undefined && (
                this.client.razon_social.toLowerCase().includes('s.a. de c.v')||
                this.client.razon_social.toLowerCase().includes('sa de cv')||
                this.client.razon_social.toLowerCase().includes('sapi de cv')||
                this.client.razon_social.toLowerCase().includes('sapi')||
                this.client.razon_social.toLowerCase().includes('s.a de c.v')||
                this.client.razon_social.toLowerCase().includes('s. c')||
                this.client.razon_social.toLowerCase().includes('s.c')||
                this.client.razon_social.toLowerCase().includes('s.a.s')||
                this.client.razon_social.toLowerCase().includes('s. a. s')||
                this.client.razon_social.toLowerCase().includes('rl de cv')
            )){
                return true
            }else{
                return false
            }
        },
    },
    created(){
        this.apiCall()
        this.$store.dispatch('contact_mode/getContactModes')
        this.$store.dispatch('payment_method/getPaymentMethods')
    },
    methods:{
        apiCall () {
            this.loader = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/companies?filter[id]=80").then(response => {
                this.client = response.data.data.map(id=>{return{
                    ...id.attributes,
                    id:id.id
                }})[0]
                this.loader = false
            })
        },
    }
}
</script>

<style>

</style>