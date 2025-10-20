<template>
  <v-container class="mb-12 pb-12" v-if="companyLists.length>0">
    <v-row class="ma-0 py-1">
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

      <!-- FORM VALIDATION WRAPPER -->
      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-row class="ma-0" style="margin-top:-30px;">
          <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'3':'4'">
            <v-autocomplete
              outlined dense
              v-model="quotation.company_branch_id"
              :items="branchesList"
              :loading="isLoadingBranch"
              :search-input.sync="searchBranch"
              hide-no-data item-value="id" item-text="name"
              :rules="[rules.selected]"
              label="Sucursal" placeholder="Escribe para buscar" attach
            >
              <template v-slot:item="{item, attrs, on}">
                <v-list-item v-on="on" v-bind="attrs">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.name}}
                      <div><span style="font-size:12px;">{{item.address}}</span></div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'3':'4'">
            <v-autocomplete
              outlined dense
              v-model="quotation.contact_id"
              :items="contactList"
              :loading="isLoadingContact"
              :search-input.sync="searchContacts"
              hide-no-data item-value="id" item-text="name"
              label="Contacto" placeholder="Escribe para buscar" attach
            >
              <template v-slot:item="{item, attrs, on}">
                <v-list-item v-on="on" v-bind="attrs">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.name}} <span v-if="item.last!=undefined">{{item.last}}</span>
                      <div><span style="font-size:12px;">{{item.company}}</span></div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'3':'0'">
            <v-text-field
              v-if="liga=='https://backendmf.unocrm.mx/'"
              outlined dense
              v-model="quotation.purchase_order"
              label="Orden de Compra"
            />
          </v-col>

          <v-col :cols="liga=='https://backendmf.unocrm.mx/'?'3':'4'">
            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field
                  clearable required
                  v-model="quotation.date"
                  :rules="[rules.dateRequired]"
                  label="Fecha Programada" outlined dense
                  prepend-inner-icon="mdi-calendar" readonly v-on="on"
                />
              </template>
              <v-date-picker :min="minDate" color="primary" v-model="quotation.date" @input="datePicker = false"/>
            </v-menu>
          </v-col>
        </v-row>

        <v-row
          class="px-2 ma-0 py-2"
          v-for="(quotation_item,k) in quotation.items"
          :key="k"
        >
          <v-col ols="12" sm="4" md="2" class="py-0 my-0">
            <v-text-field
              :suffix="quotation_item.item!=''?quotation_item.unit:''"
              type="number"
              v-model="quotation_item.quantity"
              :rules="[rules.positiveNumber]"
              label="Cantidad"
            />
          </v-col>

          <v-col ols="12" sm="8" md="6" class="py-0 my-0">
            <v-autocomplete
              v-if="quotation_item.item==''"
              item-text="key"
              v-model="quotation_item.item"
              item-value="id"
              label="Producto"
              clearable
              :items="productsList"
              :loading="isLoadingProducts"
              :search-input.sync="searchProducts"
              placeholder="Escribe para buscar o crear"
              hide-no-data
              :rules="[rules.selected]"
              @change="repriceItem(quotation_item)"
            >
              <template v-slot:item="{item, attrs, on}">
                <v-list-item v-on="on" v-bind="attrs" @click="quotation_item.unit = item.unit!=null?item.unit.name:''">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.name}}
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

            <v-row v-else class="ma-0 py-3" style="border-bottom: 1px solid #8e8e8e;">
              {{productsList.filter(product=>product.id == quotation_item.item).map(product=>product.name)[0]}}
            </v-row>
          </v-col>

          <v-col cols="12" sm="8" md="3" class="py-0 my-0">
            <v-text-field disabled v-model="quotation_item.price" prefix="$" suffix="c/u" label="Precio"/>
          </v-col>

          <v-col cols="12" sm="4" md="1">
            <v-icon @click="remove(k)" v-show="k || ( !k && quotation.items.length > 1)" color="red">mdi-close</v-icon>
            <v-icon :disabled="quotation_item.item==''" @click="add(k)" v-show="k == quotation.items.length-1" color="primary">mdi-plus</v-icon>
          </v-col>

          <div style="width:100%;" class="px-6">
            <v-row class="ma-0">
              <v-spacer/>
              <div style="text-align:center; line-height:0px; cursor:pointer;" @click="quotation_item.show_note = !quotation_item.show_note">
                <span style="font-size:12px;">Agregar Nota</span><br/>
                <v-icon style="margin-top:5px;" v-if="!quotation_item.show_note">mdi-chevron-down</v-icon>
                <v-icon style="margin-top:5px;" v-else>mdi-chevron-up</v-icon>
              </div>
              <v-spacer/>
            </v-row>
            <!-- Nota NO es requerida -->
            <v-textarea outlined v-if="quotation_item.show_note" v-model="quotation_item.client_note" label="Nota"/>
          </div>
        </v-row>

        <v-row class="ma-4 pa-4" style="background:#dddddd; border-radius:10px;">
          <v-spacer/>
          <strong>Total = {{(totalQuotation).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
          <v-spacer/>
        </v-row>

        <div class="ma-0 mx-4">
          <v-card-subtitle>Si no encontraste el producto que buscabas en nuestro catalogo, escribe aqui el producto y te lo conseguimos</v-card-subtitle>
          <!-- Nota general NO requerida -->
          <v-textarea class="mx-4" outlined v-model="quotation.client_note" label="Nota"/>
        </div>

        <div class="px-6 pb-8">
          <!-- Botón con tooltip de faltantes -->
          <v-tooltip bottom :disabled="isFormValid">
            <template v-slot:activator="{ on, attrs }">
              <!-- Usa un div como activador, no el botón directamente -->
              <div v-bind="attrs" v-on="on" style="width:100%;">
                <v-btn
                  class="elevation-0"
                  block
                  :loading="gris"
                  :disabled="gris || !isFormValid"
                  @click="save()"
                  color="#5d267b"
                  :dark="!(gris || !isFormValid)"
                >
                  Realizar Pedido
                </v-btn>
              </div>
            </template>

            <!-- Contenido del tooltip: lista de campos que faltan -->
            <div style="max-width: 320px;">
              <div v-if="missingFields.length">
                <strong>Falta completar:</strong>
                <ul style="margin:6px 0 0 18px; padding:0;">
                  <li v-for="(m, i) in missingFields" :key="i">{{ m }}</li>
                </ul>
              </div>
            </div>
          </v-tooltip>

        </div>
      </v-form>
      <!-- /FORM -->
    </v-card>

    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>

  <v-container v-else>
    <v-row class="mx-0 py-12 my-12">
      <v-spacer/>
      <v-progress-circular indeterminate color="#5d267b"/>
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
      snackbar:{ show:false, message:null, color:null },
      gris:false,
      formValid:false,                 // <-- v-form
      companyLists:[],
      datePicker:false,
      quotation:{
        bar:0,
        purchase_order:'',
        client_note:'',
        company_id:null,
        contact_id:'',
        items:[{ quantity:1, item:'', price:'', show_note:false, client_note:'' }],
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
      entries:{ products:[], contacts:[], branches:[] },
      isLoadingProducts:false,
      searchProducts:null,
      client_percentage:0,
      isLoadingContact:false,
      searchContacts:null,
      searchBranch:null,
      isLoadingBranch:null,

      // Reglas reutilizables
      rules:{
        required: v => (v !== null && v !== undefined && String(v).trim() !== '') || 'Campo requerido',
        selected: v => (!!v && Number(v) > 0) || 'Campo requerido',
        positiveNumber: v => (Number(v) > 0) || 'Debe ser mayor a 0',
        dateRequired: v => (!!v && String(v).length >= 10) || 'Campo requerido',
      }
    }
  },
  computed:{
    missingFields() {
      const out = [];
      // Top-level
      if (!this.quotation.company_branch_id) out.push('Sucursal');
      //if (!this.quotation.contact_id) out.push('Contacto');
      if (!this.quotation.date) out.push('Fecha programada');
      /*if (this.liga === 'https://backendmf.unocrm.mx/' && !String(this.quotation.purchase_order || '').trim()) {
        out.push('Orden de compra');
      }*/

      // Items
      if (!this.quotation.items || this.quotation.items.length === 0) {
        out.push('Al menos 1 producto');
      } else {
        this.quotation.items.forEach((it, idx) => {
          const n = idx + 1;
          if (!it.item) out.push(`Producto (partida ${n})`);
          if (!(Number(it.quantity) > 0)) out.push(`Cantidad > 0 (renglón ${n})`);
        });
      }

      return out;
    },

    // Si quieres que el botón se habilite sólo cuando no falte nada y el v-form esté ok:
    isFormValid() {
      // formValid viene del <v-form v-model="formValid">
      return this.formValid && this.missingFields.length === 0;
    },
    // Habilita/deshabilita el botón además de v-form
    isFormValid(){
      // Campos top
      const branchOk  = !!this.quotation.company_branch_id
      const contactOk = true//!!this.quotation.contact_id
      const dateOk    = !!this.quotation.date

      // OC requerida sólo en MF
      const ocOk = true//this.liga === 'https://backendmf.unocrm.mx/' ? !!(this.quotation.purchase_order && String(this.quotation.purchase_order).trim()) : true

      // Al menos 1 item válido y todos los items con item seleccionado y qty > 0
      const items = this.quotation.items || []
      const hasAtLeastOne = items.some(it => !!it.item && Number(it.quantity) > 0)
      const allValid = items.length > 0 && items.every(it => !!it.item && Number(it.quantity) > 0)

      // Todo junto
      return branchOk && contactOk && dateOk && ocOk && hasAtLeastOne && allValid && this.formValid
    },
    
    minDate() {
      // Hora actual *en Monterrey*
      const now = new Date();
      const monterreyNow = new Date(
        now.toLocaleString('en-US', { timeZone: 'America/Monterrey' })
      );
      const hour = monterreyNow.getHours(); // 0..23 en Monterrey

      // Formateador de fecha YYYY-MM-DD en zona Monterrey
      const fmt = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Monterrey',
        year: 'numeric', month: '2-digit', day: '2-digit'
      });

      if (hour > 17) {
        // Antes de las 17:00 en Monterrey → “hoy” NO permitido → mínimo = mañana
        const tomorrow = new Date(monterreyNow);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return fmt.format(tomorrow); // 'YYYY-MM-DD'
      } else {
        // 17:00 o después → mínimo = hoy
        return fmt.format(monterreyNow); // 'YYYY-MM-DD'
      }
    },
  
    totalQuotation(){
      let total = 0
      if(this.quotation.items.length){
        for(const it of this.quotation.items){
          const price = Number(it.price) || 0
          const qty   = Number(it.quantity) || 0
          total += price * qty
        }
      }
      return total
    },
    productTotal(){ return this.quotation.items },
    companyPercentage(){ return this.quotation.company_id },
    liga(){ return process.env.VUE_APP_BACKEND_ROUTE },
    currentUser(){ return this.$store.state.currentUser.user },
    productsList(){
      return this.entries.products.map(p => ({
        ...p,
        inventory: p.branch_inventories['Masterfrut'],
        key: `${p.name} ${p.code_one || ''}`.trim()
      }))
    },
    contactList(){
      return this.entries.contacts.map(id => ({
        id:id.id, name:id.name, last:id.last, company:id.company.name, job_position:id.job_position
      }))
    },
    branchesList(){ return this.entries.branches }
  },
  methods:{
    roundPesos(n){ return Math.round(Number(n) || 0); },
    extractPct(priceList){
      if (!priceList) return 0
      const txt = typeof priceList === 'object' ? priceList.name : String(priceList)
      const m = String(txt || '').match(/-?\d+(\.\d+)?/)
      return m ? Number(m[0]) : 0
    },
    setClientPct(){
      const companyId = this.quotation.company_id ?? this.currentUser.company_id
      const company   = this.companyLists.find(c => c.id == companyId)
      this.client_percentage = this.extractPct(company?.price_list)
    },
    repriceItem(it){
      const cost = Number(this.productsList.find(p => p.id === it.item)?.cost) || 0
      const qty  = Number(it.quantity) || 0
      const pct  = Number(this.client_percentage) || 0
      if (!cost){ it.price=''; return }
      const base = cost / (1 - pct/100)
      it.price       = this.roundPesos(base).toFixed(2)
      it.total_price = (base * qty).toFixed(2)
    },
    repriceAllItems(){
      this.quotation.items.forEach(it => { if (it.item) this.repriceItem(it) })
    },

    apiCall(){
      axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/companies?filter[id]="+this.currentUser.company_id)
        .then(res => {
          this.companyLists = res.data.data.map(x => ({ ...x.attributes, id:x.id }))
          this.quotation.company_id = this.currentUser.company_id
          this.setClientPct()
          this.repriceAllItems()
        })
    },
    add(){ this.quotation.items.push({ quantity:1, item:'', price:'', show_note:false, client_note:'' }) },
    remove(index){ this.quotation.items.splice(index,1) },
    save(){
      // valida form UI
      const ok = this.$refs.form.validate()
      if (!ok || !this.isFormValid) return

      this.quotation.company_id = this.currentUser.company_id
      this.quotation.user_id = this.currentUser.id
      this.gris = true
      this.quotation.created_by_user_id = this.currentUser.id
      this.quotation.last_updated_by_user_id = this.currentUser.id
      this.quotation.subtotal = this.totalQuotation
      this.quotation.total = this.totalQuotation
      this.quotation.iva = 0
      this.quotation.payment_status = null

      this.$nextTick(() => {
        axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales", Object.assign({}, this.quotation))
          .then(() => {
            this.quotation = {
              bar:0, purchase_order:'', client_note:'', company_id:null, contact_id:'',
              items:[{ quantity:1, item:'', price:'', show_note:false, client_note:'' }],
              status:'pedido', subtotal:'', date:'', iva:'', total:'', user_id:'',
              created_by_user_id:'', last_updated_by_user_id:'', company_branch_id:''
            }
            this.snackbar = { message:'Pedido realizado con éxito', color:'success', show:true }
            this.gris = false
            this.$refs.form.resetValidation()
          }).catch(error => {
            this.snackbar = { message:error.response?.data?.message || 'Error', color:'error', show:true }
            this.gris = false
          })
      })
    }
  },
  created(){
    if(this.currentUser) this.apiCall()
  },
  watch:{
    companyPercentage:{
      handler(){
        if(this.liga === 'https://backendmf.unocrm.mx/'){
          this.setClientPct()
          this.repriceAllItems()
        }
      },
      deep:true
    },
    productTotal:{
      handler(){
        if(this.liga === 'https://backendmf.unocrm.mx/'){
          this.repriceAllItems()
        }
      },
      deep:true
    },
    searchProducts(val){
      if (this.isLoadingProducts) return
      this.isLoadingProducts = true
      axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[is_published]=1&filter[pos]='+val)
        .then(res => { this.entries.products = this.entries.products.concat(res.data.data) })
        .finally(() => (this.isLoadingProducts = false))
    },
    searchContacts(val){
      if (this.isLoadingContact) return
      this.isLoadingContact = true
      const filter = 'filter[company_id]=' + this.currentUser.company_id
      axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/contact_p?' + filter + "&filter[name]=" + val)
        .then(res => {
          if(this.entries.contacts.length>0){
            this.entries.contacts = this.entries.contacts.concat(res.data.data)
          }else{
            this.entries.contacts = res.data.data
          }
        }).finally(() => (this.isLoadingContact = false))
    },
    searchBranch(val){
      if (this.isLoadingBranch) return
      this.isLoadingBranch = true
      axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/company_branches?filter[company_id]=' + this.currentUser.company_id + '&filter[name]=' + val)
        .then(res => { this.entries.branches = res.data.data })
        .finally(() => (this.isLoadingBranch = false))
    },
    currentUser:{
      handler(){ this.apiCall() },
      deep:true
    }
  }
}
</script>
