<template>
    <v-container class="mb-12 pb-12" v-if="companyLists.length>0">
        <v-row class="ma-0 py-1">
            <!--v-btn icon class="mr-4">
                <v-icon>
                    mdi-menu
                </v-icon>
            </v-btn-->
            <div style="font-weight:500; font-size:25px;">Hola {{currentUser.name}}</div>
            <v-spacer/>
            <a href="/account">
                <div>
                    <v-avatar size="36px" class="mr-1">
                        <v-img alt="user" src="https://backendmf.unocrm.mx/files/default.jpg"></v-img>
                    </v-avatar>
                </div>
            </a>
        </v-row>
        <v-card class="mt-5">
            <v-row class="ma-0">
                <v-card-title>Realiza tu Pedido</v-card-title>
                <v-spacer/>
                <v-btn class="elevation-0 ma-4" dark color="#5d267b">Realizar Pedido</v-btn>
            </v-row>
            <v-row class="ma-0" style="margin-top:-30px;">
                <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'4':'6'">
                    <v-autocomplete outlined dense :disabled="quotation.company_id==''" v-model="quotation.company_branch_id" :items="branchesList" :loading="isLoadingBranch" :search-input.sync="searchBranch" hide-no-data item-value="id" item-text="name" label="Sucursal" placeholder="Escribe para buscar" attach>
                        <template v-slot:item="{item, attrs, on}">
                            <v-list-item v-on="on" v-bind="attrs">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{item.name}}
                                        <div>
                                            <span style="font-size:12px;">{{item.address}}</span>
                                        </div>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template> 
                    </v-autocomplete>
                </v-col>
                <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'4':'6'">
                    <v-autocomplete outlined dense @keydown.enter="filter()" v-model="quotation.contact_id" :items="contactList" :loading="isLoadingContact" :search-input.sync="searchContacts" hide-no-data item-value="id" item-text="name" label="Contacto" placeholder="Escribe para buscar" attach>
                            <template v-slot:item="{item, attrs, on}">
                                <v-list-item v-on="on" v-bind="attrs">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{item.name}} <span v-if="item.last!=undefined">{{item.last}}</span>
                                            <div>
                                                <span style="font-size:12px;">{{item.company}}</span>
                                            </div>
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template> 
                        </v-autocomplete>
                </v-col>
                <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'4':'0'">
                    <v-text-field outlined dense v-if="liga=='https://backendmf.unocrm.mx/'" v-model="quotation.purchase_order" label="Orden de Compra"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="px-2 ma-0 py-2" v-for="(item,k) in quotation.items" :key="k">
                <v-col ols="12" sm ="4" md="2" class="py-0 my-0">
                    <v-text-field type=number v-model="item.quantity" label="Cantidad"></v-text-field>
                </v-col>
                <v-col ols="12" sm ="8" md="6" class="py-0 my-0">
                    <v-autocomplete v-if="item.item==''" item-text="key" v-model="item.item" item-value="id" label="Producto" clearable :items="productsList" :loading="isLoadingProducts" :search-input.sync="searchProducts" placeholder="Escribe para buscar o crear" hide-no-data>

                        <template v-slot:item="{item, attrs, on}">
                            <v-list-item v-on="on" v-bind="attrs" :disabled="item.inventory<=0">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{item.name}} <span v-if="liga!='https://backendmf.unocrm.mx/'">| {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                        <div v-if="liga!='https://backendmf.unocrm.mx/'">
                                            <span style="font-size:12px;">Categoría:</span>
                                            <template v-for="(category, index) in item.categories">
                                                <v-chip  v-bind:key="index" small class="ml-2"  style="font-size:8px;">{{categoryName(category)}}</v-chip>
                                            </template>
                                        </div>
                                        <div>
                                            <span style="font-size:14px;">Inventario:
                                                <strong v-if="item.inventory<1" style="color:red!important;">{{item.inventory}}</strong>
                                                <strong v-else style="color:green!important;">{{item.inventory}}</strong>
                                            </span>
                                        </div>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template> 
                    </v-autocomplete>
                    <v-row v-else class="ma-0 py-3" style="border-bottom: 1px solid #8e8e8e;">{{productsList.filter(product=>product.id ==item.item).map(product=>product.name)[0]}}</v-row>
                </v-col>
                <v-col cols="12" sm ="8" md="3" class="py-0 my-0">
                    <v-text-field disabled v-model="item.price" prefix="$" suffix="c/u" label="Precio"></v-text-field>
                </v-col>
                <v-col cols="12" sm ="4" md="1">
                    <v-icon @click="remove(k)" v-show="k || ( !k && quotation.items.length > 1)" color="red">mdi-close</v-icon>
                    <v-icon :disabled="item.item==''" @click="add(k)" v-show="k == quotation.items.length-1" color="primary">mdi-plus</v-icon>
                </v-col>
                <div style="width:100%;" class="px-6">
                    <v-row class="ma-0">
                        <v-spacer/>
                        <div style="text-align:center; line-height:0px; cursor:pointer;" @click="item.show_note = !item.show_note">
                            <span style="font-size:12px;">Agregar Nota</span>
                            <br/>
                            <v-icon style="margin-top:5px;" v-if="!item.show_note">mdi-chevron-down</v-icon>
                            <v-icon style="margin-top:5px;" v-if="item.show_note">mdi-chevron-up</v-icon>
                        </div>
                        <v-spacer/>
                    </v-row>
                    <v-textarea outlined v-if="item.show_note" label="Nota"></v-textarea>
                </div>
            </v-row>
            <v-row class="ma-4 pa-4" style="background:#dddddd; border-radius:10px;">
                    <v-spacer/>
                    <strong>Total = {{(totalQuotation).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    <v-spacer/>
                </v-row>
            <div class="ma-0 mx-4">
                <v-card-subtitle>Si no encontraste el producto que buscabas en nuestro catalogo, escribe aqui el producto y te lo conseguimos</v-card-subtitle>
                <v-textarea class="mx-4" outlined v-model="quotation.client_note" label="Nota"></v-textarea>
            </div>
        </v-card>
    </v-container>
</template>

<script>
import axios from "axios"
import dates from '../mixins/dates'
export default {
    mixins: [dates],
    data(){
        return{
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            companyLists:[],
            quotation:{
                purchase_order:'',
                client_note:'',
                datePicker:'',
                datePicker2:'',
                company_id:null,
                contact_id:'',
                items:[{
                    quantity:1,
                    item:'',
                    price:'',
                    show_note:false,
                    note:''
                }],
                status:'pedido cliente',
                subtotal:'',
                date:'',
                iva:'',
                total:'',
                user_id:'',
                created_by_user_id:'',
                last_updated_by_user_id:'',
                company_branch_id:''
            },
            entries:{
                products: [],
                contacts:[],
                branches:[]
            },
            isLoadingProducts: false,
            searchProducts: null,
            client_percentage:0,
            isLoadingContact: false,
            searchContacts: null,
            searchBranch: null,
            isLoadingBranch:null
        }
    },
    computed:{
        totalQuotation(){
            var total=0
            if(this.quotation.items.length!=0){
                for(var i=0; i<this.quotation.items.length; i++){
                    if(this.quotation.items[i].price!=undefined){
                        total = total+(this.quotation.items[i].price*this.quotation.items[i].quantity)
                    }
                }
            return total
            }
        },
        productTotal(){
            return this.quotation.items
        },
        companyPercentage(){
            return this.quotation.company_id
        },
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        currentUser(){
            return this.$store.state.currentUser.user
        },
        productsList(){
            var perro = this.entries.products.map(id=>{return{
                ...id,
                inventory:id.branch_inventories[this.currentUser.branch[0].name],
                key: id.name + ' ' + id.code_one
            }})
            return perro
        },
        contactList(){
            return this.entries.contacts.map(id => {
                return{
                    id:id.id,
                    name:id.name,
                    last:id.last,
                    company:id.company.name,
                    job_position:id.job_position
                }
            })
        }, 
        branchesList(){
            return this.entries.branches
        },
    },
    methods:{
        add(index) {
            this.quotation.items.push({ quantity: 1, item: '', price:'' });
        },
        remove(index) {
            this.quotation.items.splice(index, 1);
        },
        save(){
            
        }
    },
    watch:{
        companyPercentage:{
            handler(){
                if(this.liga=='https://backendmf.unocrm.mx/'){
                    this.client_percentage = this.companyLists.filter(company=>company.id == this.quotation.company_id).map(company=>company.price_list)[0].name.replace(/%/g,"")*1
                    for(var i=0; i<this.quotation.items.length; i++){
                        this.quotation.items[i].price = (((this.productsList.filter(item=>item.id == this.quotation.items[i].item).map(item=>item.cost)[0]/100)*(100+this.client_percentage))*1).toFixed(2)
                        this.quotation.items[i].total_price = (((this.productsList.filter(item=>item.id == this.quotation.items[i].item).map(item=>item.cost)[0]/100)*(100+this.client_percentage))*this.quotation.items[i].quantity).toFixed(2)
                    }
                }
            }, deep:true
        },
        productTotal:{
            handler(){
                if(this.liga=='https://backendmf.unocrm.mx/'){
                    for(var i=0; i<this.quotation.items.length; i++){
                        this.quotation.items[i].price = (((this.productsList.filter(item=>item.id == this.quotation.items[i].item).map(item=>item.cost)[0]/100)*(100+this.client_percentage))*1).toFixed(2)
                        this.quotation.items[i].total_price = (((this.productsList.filter(item=>item.id == this.quotation.items[i].item).map(item=>item.cost)[0]/100)*(100+this.client_percentage))*this.quotation.items[i].quantity).toFixed(2)
                    }
                }
            }, deep:true
        },
        searchProducts(val){
            //if (this.companyLists.length > 0) return
            //if(this.search){
            if (this.isLoadingProducts) return
            this.isLoadingProducts = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[pos]='+val)
            .then(res => {
                this.entries.products = this.entries.products.concat(res.data.data)
            }).finally(() => (this.isLoadingProducts = false, this.search = false))
            //}
        },
        searchContacts(val){
            //if (this.contactList.length > 0) return
            if (this.isLoadingContact) return
            this.isLoadingContact = true

            var length = this.quotation.company_id.length
            if(length>0){
                var filter = 'filter[company_id]='
                for(var i=0; i<length; i++){
                    filter = filter + 80
                }
            }else{
                var filter = ''
            }
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/contact_p?' + filter + "filter[name]=" + val)
            .then(res => {
                if(this.entries.contacts.length>0){
                    this.entries.contacts.concat(res.data.data)
                }else{
                    this.entries.contacts = res.data.data
                }
            }).finally(() => (this.isLoadingContact = false))
        },
        searchBranch(val){
            //if (this.contactList.length > 0) return
            if (this.isLoadingBranch) return
            this.isLoadingBranch = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/company_branches?filter[company_id]=' + localStorage.getItem('user_company_id') + '&filter[name]=' + val)
            .then(res => {
                /*if(this.entries.contacts.length>0){
                    this.entries.contacts.concat(res.data.data)
                }else{*/
                    this.entries.branches = res.data.data
                //}
            }).finally(() => (this.isLoadingBranch = false))
        },
    },
    created(){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/companies?filter[id]=80").then(response => {
            this.companyLists = response.data.data.map(id=>{return{
                ...id.attributes,
                id:id.id
            }})
            this.loader = false
        })
    }
}
</script>

<style>
</style>