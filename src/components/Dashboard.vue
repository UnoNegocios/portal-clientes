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
            </v-row>
            <v-row class="ma-0" style="margin-top:-30px;">
                <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'3':'4'">
                    <v-autocomplete outlined dense v-model="quotation.company_branch_id" :items="branchesList" :loading="isLoadingBranch" :search-input.sync="searchBranch" hide-no-data item-value="id" item-text="name" label="Sucursal" placeholder="Escribe para buscar" attach><!--:disabled="quotation.company_id==''"-->
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
                <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'3':'4'">
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
                <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'3':'0'">
                    <v-text-field outlined dense v-if="liga=='https://backendmf.unocrm.mx/'" v-model="quotation.purchase_order" label="Orden de Compra"></v-text-field>
                </v-col>
                <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'3':'4'">
                <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="quotation.date" label="Fecha Programada" outlined dense prepend-inner-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker :min="minDate" color="primary" v-model="quotation.date" @input="datePicker = false"></v-date-picker>
                </v-menu>
                </v-col>
            </v-row>
            <v-row class="px-2 ma-0 py-2" v-for="(quotation_item,k) in quotation.items" :key="k">
                <v-col ols="12" sm ="4" md="2" class="py-0 my-0">
                    <v-text-field :suffix="quotation_item.item!=''?quotation_item.unit:''" type=number v-model="quotation_item.quantity" label="Cantidad"></v-text-field>
                </v-col>
                <v-col ols="12" sm ="8" md="6" class="py-0 my-0">
                    <v-autocomplete v-if="quotation_item.item==''" item-text="key" v-model="quotation_item.item" item-value="id" label="Producto" clearable :items="productsList" :loading="isLoadingProducts" :search-input.sync="searchProducts" placeholder="Escribe para buscar o crear" hide-no-data>

                        <template v-slot:item="{item, attrs, on}">
                            <v-list-item v-on="on" v-bind="attrs" @click="quotation_item.unit = item.unit!=null?item.unit.name:''" ><!--:disabled="item.inventory<=0"-->
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
                    <v-row v-else class="ma-0 py-3" style="border-bottom: 1px solid #8e8e8e;">{{productsList.filter(product=>product.id ==quotation_item.item).map(product=>product.name)[0]}}</v-row>
                </v-col>
                <v-col cols="12" sm ="8" md="3" class="py-0 my-0">
                    <v-text-field disabled v-model="quotation_item.price" prefix="$" suffix="c/u" label="Precio"></v-text-field>
                </v-col>
                <v-col cols="12" sm ="4" md="1">
                    <v-icon @click="remove(k)" v-show="k || ( !k && quotation.items.length > 1)" color="red">mdi-close</v-icon>
                    <v-icon :disabled="quotation_item.item==''" @click="add(k)" v-show="k == quotation.items.length-1" color="primary">mdi-plus</v-icon>
                </v-col>
                <div style="width:100%;" class="px-6">
                    <v-row class="ma-0">
                        <v-spacer/>
                        <div style="text-align:center; line-height:0px; cursor:pointer;" @click="quotation_item.show_note = !quotation_item.show_note">
                            <span style="font-size:12px;">Agregar Nota</span>
                            <br/>
                            <v-icon style="margin-top:5px;" v-if="!quotation_item.show_note">mdi-chevron-down</v-icon>
                            <v-icon style="margin-top:5px;" v-if="quotation_item.show_note">mdi-chevron-up</v-icon>
                        </div>
                        <v-spacer/>
                    </v-row>
                    <v-textarea outlined v-if="quotation_item.show_note" v-model="quotation_item.client_note" label="Nota"></v-textarea>
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
            <div class="px-6 pb-8">
                <v-btn class="elevation-0" block :loading="gris" :disabled="gris" @click="save()" :dark="!gris" color="#5d267b">Realizar Pedido</v-btn>
            </div>
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
    <v-container v-else>
        <v-row class="mx-0 py-12 my-12">
            <v-spacer/>
            <v-progress-circular indeterminate color="#5d267b"></v-progress-circular>
            <v-spacer/>
        </v-row>
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
            datePicker:false,
            quotation:{
                bar:0,
                purchase_order:'',
                client_note:'',
                company_id:null,
                contact_id:'',
                items:[{
                    quantity:1,
                    item:'',
                    price:'',
                    show_note:false,
                    client_note:''
                }],
                status:'pedido',
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
        minDate(){
            const now = new Date();
            const hour = now.getHours();
            // Si la hora es antes de las 17:00 (5 PM)
            if (hour < 17) {
                // Devuelve el día actual en formato YYYY-MM-DD
                return now.toISOString().split('T')[0];
            } else {
                // Si es después de las 17:00 (5 PM), devuelve el día siguiente
                now.setDate(now.getDate() + 1);
                return now.toISOString().split('T')[0];
            }
        },
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
                inventory:id.branch_inventories['Masterfrut'],
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
        apiCall(){
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/companies?filter[id]="+this.currentUser.company_id).then(response => {
                this.companyLists = response.data.data.map(id=>{return{
                    ...id.attributes,
                    id:id.id
                }})
                this.loader = false
            })
        },
        add(index) {
            this.quotation.items.push({ quantity: 1, item: '', price:'', show_note:false, client_note:''});
        },
        remove(index) {
            this.quotation.items.splice(index, 1);
        },
        save(){
            this.quotation.company_id = this.currentUser.company_id
            this.quotation.user_id = this.currentUser.id
            //this.quotation.date = new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
            this.gris = true
            this.quotation.created_by_user_id = this.currentUser.id
            this.quotation.last_updated_by_user_id = this.currentUser.id
            this.quotation.subtotal = this.totalQuotation
            this.quotation.total = this.totalQuotation
            this.quotation.iva = 0
            this.quotation.payment_status = null
            this.$nextTick(() => {
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales",Object.assign(this.quotation)).then(response=>{
                    this.$nextTick(() => {
                        this.quotation={
                            bar:0,
                            purchase_order:'',
                            client_note:'',
                            company_id:null,
                            contact_id:'',
                            items:[{
                                quantity:1,
                                item:'',
                                price:'',
                                show_note:false,
                                client_note:''
                            }],
                            status:'pedido',
                            subtotal:'',
                            date:'',
                            iva:'',
                            total:'',
                            user_id:'',
                            created_by_user_id:'',
                            last_updated_by_user_id:'',
                            company_branch_id:''
                        }
                        this.snackbar = {
                            message: 'Pedido realizado con éxito',
                            color: 'success',
                            show: true
                        }
                        this.gris = false
                    })
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
    created(){
        if(this.currentUser!=undefined){
            this.apiCall()
        }
    },
    watch:{
        companyPercentage:{
            handler(){
                if(this.liga==='https://backendmf.unocrm.mx/'){
                const pct = Number(
                    this.companyLists
                    .find(c => c.id === this.quotation.company_id)?.price_list?.name
                    ?.replace('%','')
                ) || 0
                this.client_percentage = pct
                for (let i = 0; i < this.quotation.items.length; i++) {
                    const itemId = this.quotation.items[i].item
                    const cost = Number(this.productsList.find(p => p.id === itemId)?.cost) || 0
                    const qty  = Number(this.quotation.items[i].quantity) || 0
                    const price = cost / (1 - pct/100)
                    this.quotation.items[i].price       = price.toFixed(2)
                    this.quotation.items[i].total_price = (price * qty).toFixed(2)
                }
                }
            }, 
            deep:true
        },
        productTotal:{
            handler(){
                if(this.liga==='https://backendmf.unocrm.mx/'){
                    const pct = Number(this.client_percentage) || 0
                    for (let i = 0; i < this.quotation.items.length; i++) {
                        const itemId = this.quotation.items[i].item
                        const cost = Number(this.productsList.find(p => p.id === itemId)?.cost) || 0
                        const qty  = Number(this.quotation.items[i].quantity) || 0
                        const price = cost / (1 - pct/100)
                        this.quotation.items[i].price       = price.toFixed(2)
                        this.quotation.items[i].total_price = (price * qty).toFixed(2)
                    }
                }
            }, 
            deep:true
        },

        searchProducts(val){
            //if (this.companyLists.length > 0) return
            //if(this.search){
            if (this.isLoadingProducts) return
            this.isLoadingProducts = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[is_published]=1&filter[pos]='+val)
            .then(res => {
                this.entries.products = this.entries.products.concat(res.data.data)
            }).finally(() => (this.isLoadingProducts = false, this.search = false))
            //}
        },
        searchContacts(val){
            //if (this.contactList.length > 0) return
            if (this.isLoadingContact) return
            this.isLoadingContact = true
            var filter = 'filter[company_id]=' + this.currentUser.company_id
            /*for(var i=0; i<length; i++){
                filter = filter + 80
            }*/
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
        currentUser:{
            handler(){
                this.apiCall()
            }, deep:true
        }
    }
}
</script>

<style>
</style>