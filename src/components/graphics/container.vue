<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <v-row class="ma-0 pa-0" >
            <v-card-title>Reporte Mensual</v-card-title>
        </v-row>
        <v-row class="ma-0 pl-4 pr-12">
            <v-select outlined dense class="mr-12 pr-12" item-text="label" :items="periods" item-value="value" v-model="filter"></v-select>
        </v-row>
        <v-card v-if="showReport" id="chart" class="elevation-0" style="background:transparent; margin-left:-10px;">
            <apexchart type="bar" :height="chartHeight" :options="chartOptions" :series="series"></apexchart>
        </v-card>
        <v-row class="ma-0 pt-12 mt-12" v-else>
            <v-spacer/>
                <div style="text-align:center;">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    <br/>
                    <v-card-title>Cargando...</v-card-title>
                </div>
            <v-spacer/>
        </v-row>
    </v-container>
</template>

<script>
import dates from '../../mixins/dates'
import axios from "axios"
export default {
    mixins: [dates],
    data: function () {
        return {
            filter:3,
            showReport: false,
            series: [{
                name: 'Comisión',
                data: []
            }],
            x:[],
            y:[],
            chartOptions: {
                plotOptions: {
                    bar: {
                        barHeight: this.height,
                        borderRadius: 10,
                        dataLabels: {
                            orientation: 'vertical'
                        }
                    }
                },
                colors:'#c57de4',
                dataLabels: {
                    formatter: function (val) {
                        return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN'})
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (y) {
                            return y.toLocaleString('es-MX', { style: 'currency', currency: 'MXN'})
                        },
                    }
                },
                xaxis: {
                    type: 'string',
                    labels: {
                        rotate: -90,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        },
                    },
                },
                yaxis: {
                    labels: {
                        formatter: (val) => {
                            return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                        },
                        style: {
                            fontSize: '0px'
                        },
                    },
                },
            },
        }
    },
    watch:{
        filter:{
            handler(){
                this.showReport = false
                this.series[0].data = this.y.slice(0,this.filter)
                this.chartOptions.xaxis.categories = this.x.slice(0,this.filter)
                this.$nextTick(() => {
                    this.showReport = true
                })
            }, deep:true
        }
    },
    created(){
        this.showReport = false
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/influencer-collabs?type=report').then(response=>{
            var data = response.data.sort(function(a,b){
                return (a.month*1) - (b.month*1)
            })
            this.y = data.map(influencer=>influencer.influencer_amount)
            this.x = data.map(influencer=>this.monthFormat(influencer.month))
            this.series[0].data = this.y.slice(0,this.filter)
            this.chartOptions.xaxis.categories = this.x.slice(0,this.filter)
            this.showReport = true
        })
    },
    computed: {
        height(){
            return (this.series[0].data.sort()[0].toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}).length*21) + 200
        },
        chartHeight(){
            return 600
        },
        periods(){
            return [
                {label:'Últimos 3 meses', value:3},
                {label:'Últimos 6 meses', value:6},
                {label:'Últimos 12 meses', value:12},
            ]
        },
        selectedPeriod(){
            return this.periods.filter(item=>item.value == this.filter).map(item=>item.label)[0]
        },
    },
}
</script>