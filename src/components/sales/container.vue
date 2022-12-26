<template>
    <v-container>
        <v-row class="ma-0">
            <v-col cols="2">
                <v-btn icon to="/">
                    <v-icon>
                        mdi-chevron-left
                    </v-icon>
                </v-btn>
            </v-col>
            <v-col cols="8">
                <v-row class="ma-0">
                    <v-spacer/>
                    <div style="font-weight:500; font-size:21px; line-height:37px;">Colaboraciones</div>
                    <v-spacer/>
                </v-row>
            </v-col>
            <v-col cols="2">
            </v-col>
        </v-row>

        <v-row class="ma-0">
            <v-card class="px-6 elevation-0" style="background:transparent;">
                <v-card-subtitle class="ma-0 pa-0 pt-2" style="color:black!important;">
                    Cobrado
                    <br/>
                    <span style="font-size:25px; line-height:32px; font-weight:600; color:black!important;">{{(card.received*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                </v-card-subtitle>
                <v-card-subtitle class="ma-0 pa-0 pt-0" style="color:black!important;">
                        Pendientes
                        <strong>{{(card.pending*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                </v-card-subtitle>
            </v-card>
            <v-spacer/>
            <v-avatar size="50px" class="ma-4 mr-6">
                <img src="/avatar.png" >
            </v-avatar>
        </v-row>

        <v-row class="ma-0 px-6 py-4">
            <v-progress-linear :value="((100/((card.received*1)+(card.pending*1)))*card.received)"></v-progress-linear>
        </v-row>

        <v-row class="ma-0">
            <v-spacer/>
            <v-menu offset-y :close-on-content-click="closeDatePicker">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn rounded class="elevation-0 mt-2" color="primary" dark v-bind="attrs" v-on="on">
                        <v-icon class="mr-2" small>mdi-calendar-blank</v-icon>{{selectedPeriod}}
                    </v-btn>
                </template>
                <v-date-picker type="month" v-model="selectedPeriod2" range></v-date-picker>
            </v-menu>


            <v-spacer/>
        </v-row>
        <div v-if="show_pestañita" style="width:calc(100vw - 24px); position:absolute; bottom:0px;">
            <v-row class="ma-0">
                <v-btn style="margin: auto auto 80px; background: white; border-radius: 10px 10px 0px 0px; width: 100px;" icon @click="half">
                    <v-icon large>mdi-chevron-up</v-icon>
                </v-btn>
            </v-row>
        </div>

        <swipeable-bottom-sheet ref="swipeableBottomSheet">
            <v-card class="elevation-0 py-0 px-2" v-for="(collab, index) in collabs" :key="index" @click="openCollab(collab)">
                <v-row class="ma-0" style="color:black!important;">
                    <v-col cols="6" class="pa-0">
                        <v-card-title style="font-size:16px; font-weight:500;">{{collab.brand}}</v-card-title>
                        <v-card-subtitle style="line-height:10px; font-size:12px; color:grey;">{{date(collab.influencer_payment_date, collab.payment_promise_date)}}</v-card-subtitle>
                    </v-col>
                    <v-col cols="6" class="pa-0" style="text-align:right;">
                        <v-card-title :style="'font-size:17px; display: block; font-weight:600;' + color(collab.influencer_payment_date)">{{(collab.influencer_amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-card-title>
                        <v-card-subtitle :style="'font-size:13px; font-weight:500; color:' + colorStatus(collab.collab_status) + ';'">{{collab.collab_status}}</v-card-subtitle>
                    </v-col>
                </v-row>
                <v-divider/>
            </v-card>
            <div style="height:220px;"></div>
        </swipeable-bottom-sheet>
        
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card style="background:#f4f5fb;">
                <v-toolbar class="elevation-0 px-2 pt-4 mb-4" style="background:#f4f5fb;">
                    <v-btn icon @click="closeDialog()">
                        <v-icon>
                            mdi-chevron-left
                        </v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card style="background:#f4f5fb;" class="elevation-0 px-4">
                    <v-card-title style="font-size:21px;">{{collab.brand}}</v-card-title>
                    <v-card-subtitle>{{date(collab.influencer_payment_date, collab.payment_promise_date)}}</v-card-subtitle>
                    <v-chip class="ml-4" dark :color="colorStatus(collab.collab_status)">{{collab.collab_status}}</v-chip>
                </v-card>

                <v-row class="ma-0 px-4 mt-5">
                    <v-card-subtitle style="font-size:16px;">Subtotal</v-card-subtitle>
                    <v-spacer/>
                    <v-card-subtitle style="font-size:16px;">{{(collab.influencer_amount/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-card-subtitle>
                </v-row>

                <v-row class="ma-0 px-4">
                    <v-card-subtitle style="font-size:16px;" class="py-0">IVA</v-card-subtitle>
                    <v-spacer/>
                    <v-card-subtitle style="font-size:16px;" class="py-0">{{(collab.influencer_amount*.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-card-subtitle>
                </v-row>
                
                <v-row class="ma-0 px-4 mb-5">
                    <v-card-title style="font-size:24px;">Monto</v-card-title>
                    <v-spacer/>
                    <v-card-title style="font-size:24px;">{{(collab.influencer_amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-card-title>
                </v-row>
                    
                <v-card class="elevation-0 pa-4 mx-7">
                    <v-row class="ma-0">
                        <strong>Servicio</strong>
                        <v-spacer/>
                        {{collab.service}}
                    </v-row>
                    <v-divider class="my-4"/>
                    <v-row class="ma-0">
                        <strong>Campaña</strong>
                        <v-spacer/>
                        {{collab.campaign}}
                    </v-row>
                </v-card>
                
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import dates from '../../mixins/dates'
import { SwipeableBottomSheet } from "vue-swipeable-bottom-sheet";

export default {
    mixins: [dates],
    components: {
        SwipeableBottomSheet
    },
    data(){
        return{
            selectedPeriod:[],
            selectedPeriod2:[],
            dialog: false,
            collab:{},
            period:[],
            show_pestañita: false,
        }
    },
    watch:{
        collabs:{
            handler(){
                this.show_pestañita = true
            }, deep: true,
        },
        selectedPeriod2:{
            handler(){
                if(this.selectedPeriod2.length==2){
                    const period = [
                        new Date(new Date(this.selectedPeriod2[0]+'-15').getFullYear(), new Date(this.selectedPeriod2[0]+'-15').getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10),
                        new Date(new Date(this.selectedPeriod2[1]+'-15').getFullYear(), new Date(this.selectedPeriod2[1]+'-15').getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    ]
                    const ordered_period = period.sort(function(a,b){
                        return new Date(a) - new Date(b);
                    });
                    this.period = [ordered_period[0].toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10), ordered_period[1].toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)]
                    this.selectedPeriod = this.monthFormat(this.period[0].slice(5, 7)).slice(0, 3) + ' ' + this.period[0].slice(0, 4) + ' - ' + this.monthFormat(this.period[1].slice(5, 7)).slice(0, 3) + ' ' + this.period[1].slice(0, 4)
                    this.open()
                    this.$store.dispatch('collab/getCard', {from:this.period[0], to:this.period[1]})
                    this.$store.dispatch('collab/getCollabs', {date_between:this.period})
                }
            }, deep: true,
        },
    },
    created(){
        var startDate = []
        var date = new Date()
        startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)

        startDate[1] = new Date(date.getFullYear(), date.getMonth() + 2, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)

        this.$store.dispatch('collab/getCard', {from:startDate[0], to:startDate[1]})
        this.$store.dispatch('collab/getCollabs', {date_between: startDate})
        this.selectedPeriod  = this.monthFormat(startDate[0].slice(5, 7)).slice(0, 3) + ' ' + startDate[0].slice(0, 4) + ' - ' + this.monthFormat(startDate[1].slice(5, 7)).slice(0, 3) + ' ' + startDate[1].slice(0, 4)
    },
    computed:{
        closeDatePicker(){
            if(this.selectedPeriod2!=null){
                if(this.selectedPeriod2.length==2){
                    return true
                }else{
                    return false
                }
            }else{
                this.selectedPeriod = []
            }
        },
        loader(){
            return this.$store.state.collab.loading
        },
        collabs(){
            return  this.$store.state.collab.collabs
        },
        total(){
            return  this.$store.state.collab.total
        },
        card(){
            return this.$store.state.collab.card
        },
        cardLoader(){
            return this.$store.state.collab.loading_card
        },
    },
    methods: {
        startDate(start, end){
            var startDate = []
            var date = new Date()
            startDate[0] = new Date(date.getFullYear(), date.getMonth() + start, 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
            startDate[1] = new Date(date.getFullYear(), date.getMonth() + end, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
            return startDate
        },
        openCollab(collab){
            this.collab = collab
            this.dialog = true
        },
        closeDialog(){
            this.collab = {}
            this.dialog = false
        },
        color(date){
            if(date==null){
                return 'color:grey!important;'
            }else{
                return 'color:black!important;'
            }
        },
        colorStatus(collab_status){
            if(collab_status=='Pendiente'){
                return 'black'
            }else if(collab_status=='Pagado al Talento') {
                return "#31d158"
            }
            else if(collab_status=='Pagado por la Marca') {
                return "#ffbf00"
            }
        },
        date(influencer_payment_date, payment_promise_date){
            if(influencer_payment_date!=null){
                return this.dateFormat(influencer_payment_date)
            }else{
                return this.dateFormat(payment_promise_date)
            }
        },
        half () {
            this.$refs.swipeableBottomSheet.setState("half")
        },
        open () {
            this.$refs.swipeableBottomSheet.setState("open")
        },
        close () {
            this.$refs.swipeableBottomSheet.setState("close")
        }
    }

}
</script>

<style>
    [data-state="half"]{
        top:270px!important;
    }
    [data-state="open"]{
        top:70px!important;
    }
    .pan-area[data-v-5d6b6420] {
        padding: 12px 0 20px 0!important;
    }
    .v-picker__title__btn.v-date-picker-title__date.v-picker__title__btn--active{
        display: none;
    }
</style>