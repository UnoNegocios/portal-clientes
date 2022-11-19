<template>
    <v-container class="mb-12 pb-12">
        <v-row class="ma-0 py-1">
            <v-btn icon class="mr-4">
                <v-icon>
                    mdi-menu
                </v-icon>
            </v-btn>
            <div style="font-weight:500; font-size:25px;">Hola {{currentUser.name}}</div>
            <v-spacer/>
            <v-avatar size="36px" class="mr-1">
                <img src="/avatar.png" >
            </v-avatar>
        </v-row>
        <v-card class="mt-4 px-6 pt-6 pb-3 elevation-0" style="background:black; border-radius:10px; background-image:url('/bg-2.png'); background-size: cover;" dark>
            
            <v-card-subtitle class="ma-0 pa-0" style="font-size:10px; line-height:20px;">
                {{currentMonth}}
            </v-card-subtitle>
            <v-card-title class="pa-0">
                <v-row class="ma-0">
                    Colaboraciones
                    <v-spacer/>
                    <v-btn icon to="/sales">
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </v-card-title>
            <v-card-subtitle class="ma-0 pa-0 pt-2" style="color:white;">
                <v-row class="ma-0">
                    Cobrado
                    <v-spacer/>
                    <span style="font-size:18px; font-weight:600;">{{(card.received*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                </v-row>
            </v-card-subtitle>
            <v-card-subtitle class="ma-0 pa-0 pt-0">
                <v-row class="ma-0">
                    Pendientes
                    <v-spacer/>
                    {{(card.pending*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </v-row>
            </v-card-subtitle>
            <v-card-actions class="mt-3 px-0">
                <v-btn block class="elevation-0" to="/sales">
                    Ver Todo
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="my-4 pt-6 pb-2 elevation-0" style="background:white; border-radius:10px; background-size: cover;" >
            <v-row class="ma-0 px-6">
                <div>
                    <v-card-title class="pa-0">
                        Anuncios
                    </v-card-title>
                    <v-card-subtitle class="ma-0 pa-0">
                        Enterate de lo mas nuevo
                    </v-card-subtitle>
                </div>
                <v-spacer/>
                <lottie-player src="https://lottie.host/e562d92d-a018-461a-b175-9c0acb72bc4c/m9STzlPBE0.json" background="transparent" speed="1" style="width: 50px; height: 50px;" loop autoplay></lottie-player>
            </v-row>
            <v-card-actions class="mt-3 px-2">
                <v-col cols="4" class="pa-0 px-1">
                    <v-btn to="/events" block class="elevation-0 py-6 px-0" x-small>
                        <v-icon x-small class="mr-1">mdi-calendar</v-icon>
                        Eventos
                    </v-btn>
                </v-col>
                <v-col cols="4" class="pa-0 px-1">
                    <v-btn to="/news" block class="elevation-0 py-6 px-0" x-small>
                        <v-icon x-small class="mr-1">mdi-newspaper-variant-outline</v-icon>
                        Noticias
                    </v-btn>
                </v-col>
                <v-col cols="4" class="pa-0 px-1">
                    <v-btn to="/documents" block class="elevation-0 py-6 px-0" x-small>
                        <v-icon x-small class="mr-1">mdi-file-document-outline</v-icon>
                        Documentos
                    </v-btn>
                </v-col>
            </v-card-actions>
        </v-card>



        <v-container class="fill-height pa-0" fluid style="background:#c67ce4; border-radius:10px; background-image: linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,.45)),url('/talents_banner.png'); background-position:center; background-size: cover; height:200px;" >
            <div style="margin:auto!important; text-align:center;">
            <span style="font-size:30px; font-family:oswald; color:white; font-weight:500;">CONOCE PEACHMX</span>
            <br/>
            <br/>

            <v-dialog v-model="video" max-width="720px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" class="px-3 py-4 peach-button-purple"><strong>VER VIDEO</strong><v-icon small class="ml-1">mdi-play-circle-outline</v-icon></v-btn>
                </template>
                <iframe width="720" height="400" src="https://www.youtube.com/embed/21IfehvNXDM" frameborder="0" autoplay="1" allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </v-dialog>


            

            </div>
        </v-container>
    </v-container>
</template>

<script>
import dates from '../mixins/dates'
export default {
    mixins: [dates],
    data(){
        return{
            video:false
        }
    },
    computed:{
        currentUser(){
            return this.$store.state.currentUser.user
        },
        card(){
            return this.$store.state.collab.initial_card
        },
        loading(){
            return this.$store.state.collab.initial_loading_card
        }
    },
    created(){
        var startDate = []
        var date = new Date()
        startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        this.$store.dispatch('collab/getInitialCard', {from:startDate[0], to:startDate[1]})
    }
}
</script>

<style>
.peach-button-purple{
    box-shadow: -5px -6px 0 0 #cc82eb, -5px -6px 0 2px #000;
    border: solid 3px black!important;
    border-radius: 5px;
    background: white!important;
    color: black!important;
}
</style>