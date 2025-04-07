<template>
    <v-container style="max-width:100vw; margin-bottom:100px;">
        <!--header-->
        <v-toolbar flat class="px-4 pt-3">
            <v-toolbar-title>
                Historial de Pedidos
            </v-toolbar-title>
        </v-toolbar>
        <!-- Tabla -->
        <v-data-table 
        height="600"
        fixed-header
        :footer-props="{'items-per-page-options':[15, 30, 50, salesLength]}"
        v-if="showTable && tableGraph"
        :headers="headers" 
        :items="sales"
        class="elevation-0 px-6 pb-4 pt-10"
        :options.sync="options"
        :server-items-length="totalSales"
        :loading="loading"
        :item-class="itemRowBackground" 
        show-expand>
            <template v-slot:[`item.printed`]="{ item }">
                <v-icon v-if="item.printed!=true" color="grey"> mdi-close </v-icon>
                <v-icon v-else color="primary"> mdi-check </v-icon>
            </template>
            <template v-slot:[`item.company_branch`]="{ item }">
                <span v-if="item.company_branch!=undefined">{{item.company_branch.name}}</span>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de pedidos aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company_id`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company_id}}</v-list-item>
            </template>
            <template v-slot:[`item.status`]="{ item }">
                <v-chip small :dark="true" :color="item.status=='Surtido'?'success':(item.status=='En Producción'?'#E53935':(item.status=='Pendiente'?'grey':''))">{{item.status}}</v-chip>
            </template>
            <!-- Detalle PC -->
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="pb-4">
                    <v-row class="pa-6 pb-0">
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table :items-per-page="item.items.length" :headers="headers2" :items="item.items" v-if="item.items!=undefined" class="elevation-0" style="background: #f7f7f7;!important" dense>

                                <template v-slot:[`item.item`]="{ item }">
                                    {{ item.item.name }}
                                </template>

                                <template v-slot:[`item.totalWeight`]="{ item }">
                                    <span>{{ item.quantity }}</span>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </td>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        salesLength:0,
        filterMobile:false,
        editDialogDetail:false,
        addDialogDetail:false,
        editedDetail:'',
        addDetail:'',
        merma:['Merma', 'Devolución'],
        editedItem:{
            id:'',
            status:'',
            rejection_comment:'',
            rejection_id:'',
            items: [],
            last_updated_by_user_id:''
        },
        totals:'',
        editedBarSales:'',
        searchInput:'',
        tableGraph:true,
        showTable:true,
        totalSales: 0,
        sales: [],
        loading: true,
        options: {},
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
        statusss:'pedido',
        sale:'',
        invoiceDialog: false,
        sheet2: false,
        sheet: false,
        filters: false,
        emailDialog: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        rejectionDialog:false,
        deleteId:'',
        rejectionData:'',
        rejectionId:'',
        filterStorageLength:0,
    }),
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    mounted(){
        Echo.channel('sales').listen('OrderInProduction', (e) => {
            console.log(e)
            console.log('1')
            var updatedSale = this.sales.filter(sale=>sale.id == e[0])[0]
            if(updatedSale!=undefined){
                this.sales.filter(sale=>sale.id == e)[0].is_in_production = true
            }
        })
        Echo.channel('sales_dispatched').listen('OrderDispatched', (e) => {
            console.log(e)
            console.log('2')
            var updatedSale = this.sales.filter(sale=>sale.id == e[0])[0]
            if(updatedSale!=undefined){
                this.sales.filter(sale=>sale.id == e)[0].production_dispatched = true
            }
        })
    },
    computed: {
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        headers2(){
            var headers = [
                { text: 'Cantidad', value: 'quantity',},
                { text: 'Producto | Servicio', value: 'item',},
                
            ]
            return headers.concat([{ value: 'actions', sortable: false, align: 'end', }])
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            return [
            { text: '', value: 'data-table-expand' },
            { text: 'Folio', value: 'id' },
            { text: 'production', value: 'production' },
            { text: 'Status', value: 'status' },
            { text: 'Fecha Programada', value: 'date' },
            { text: this.liga=='https://backendmf.unocrm.mx/'?'Comedor':'Sucursal', value: 'company_branch' },
            { text: 'Orden de Compra', value: 'purchase_order' },
            { text: 'Vendedor', value: 'user_id' },
            { text: 'Fecha Factura', value: 'invoice_date' },
            { text: 'Fecha de Vencimiento', value: 'balance_due_date', sortable: false },
            { text: 'Fecha de Entrega', value: 'shipping_date', sortable: false },
            { text: 'Factura', value: 'invoice', sortable: false },
        ]},
    },
    methods: { 
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.editedBarSales
                this.sales = data.items
                this.totalSales = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersSalesLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = ''
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?filter[status]=pedido,pedido cliente,vendido&filter[company_id]=" + localStorage.getItem('user_company_id') + "&" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    this.salesLength = response.data.meta.total
                    items = this.mapSales(response.data.data)
                    total = response.data.meta.total
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            axios
                            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?filter[status]=pedido,pedido cliente,vendido&filter[company_id]=" + localStorage.getItem('user_company_id') + "&" + link + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapSales(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }else{
                            axios
                            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?filter[status]=pedido,pedido cliente,vendido&filter[company_id]=" + localStorage.getItem('user_company_id') + "&" + link + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapSales(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }
                    }else{
                        resolve({
                            items,
                            total,
                        })
                    }
                })
            })
        },
        salesman(user){
            if(user!=undefined){
                if(user.last!=null){
                    return user.name + ' ' + user.last
                }else{
                    return user.name
                }
            }
        },
        priceList(id){
            if(id!=undefined){
                return id.name
            }
        },
        macro(macro){
            if(macro!=null){
                return macro + ' | '
            }else{
                return ''
            }
        },
        mapSales(sales){
            sales = sales.map(id=>{
                return{
                    purchase_order:id.purchase_order,
                    status:id.production!=null?(id.production.is_completed?'Surtido':'En Producción'):'Pendiente',
                    datePicker: false,
                    id:id.id,
                    company_id: this.macro(id.company.attributes.macro) + this.nombre(id.company.attributes),
                    companyID: id.company.id,
                    delivery_address:id.company.attributes.delivery_address,
                    razon_social: id.company.attributes.razon_social,
                    direccion: id.company.attributes.address,
                    delivery_time: id.company.attributes.delivery_time,
                    macro:id.company.attributes.macro,

                    //contact:this.contact(id.contact),
                    user_id:this.salesman(id.company.attributes.user),
                    created_by_user_id:this.salesman(id.created_by_user_id),
                    last_updated_by_user_id:this.salesman(id.last_updated_by_user_id),
                    price_list:this.priceList(id.price_list), 
                    utility:(id.utility.toFixed(2)*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),

                    total:(id.total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    pdf:id.pdf,
                    pdf2:id.pdf2,
                    note:id.note,
                    bar:id.bar,
                    date:id.date,
                    type:id.type,
                    items:id.items.map(item=>{
                        return{
                            id: item.id,
                            item: item.item,
                            quantity: item.quantity,
                            quotation: item.quotation,
                            rejection_status: item.rejection_status,
                        }
                    }),
                    created_at:id.created_at.slice(0, 18),
                    updated_at:id.updated_at.slice(0, 18),   
                    printed:id.printed,
                    invoice_date:id.invoice_date,  
                    invoice:id.invoice,
                    //remission:id.remission,
                    company_branch:id.company_branch,
                }
            });
            return sales
        },
        nombre(empresa){
            if(empresa!=undefined){
                if(empresa.name == undefined || empresa.name == '' || empresa.name == null){
                    return empresa.razon_social
                }else{
                    return empresa.name
                }
            }
        },
        itemRowBackground: function (item) {
            return item.status == 'cancelled' ? 'cancelled' : 'normal'
        },
        existe(item){
            if(item!=null){
                return item.id*1
            }else{
                return ''
            }
        }
    }
}
</script>
<style>
    .cancelled {
        background-color: #fff5d7
    }
    .normal {
        background-color: white
    }
    .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
        box-shadow: none!important;
        background: #f7f7f7;
    }
    .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%), 0px 1px 5px 0px rgb(0 0 0 / 0%)!important;
    }
</style>