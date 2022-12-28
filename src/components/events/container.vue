<template>
  <v-container>
    <v-row class="ma-0 pa-0" >
        <v-card-title class="px-0">Próximos Eventos</v-card-title>
    </v-row>
    <div v-if="events.length>0">
    <v-card v-for="(event, index) in events" :key="index" class="py-4 px-6 mb-4 elevation-0" @click="openDetail(event)">
        <v-card-title style="font-size:18px;" class="ma-0 pa-0">{{event.title}}</v-card-title>
        <v-chip class="mx-0 mb-2 mt-0" dark x-small :color="event.activity_type.color" style="font-weight:500; border-radius:3px;">{{event.activity_type.name}}</v-chip>
        <div style="color:grey; font-size:13px; line-height:18px;">{{event.description.slice(0,130)}}...</div>
        <v-row class="ma-0">
            <v-spacer/>
            <v-card-subtitle style="font-size:12px; color:grey; font-weight:600;" class="ma-0 pa-0">{{event.only_date}}</v-card-subtitle>
        </v-row>
    </v-card>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card v-if="dialog" class="elevation-0">
            <v-row class="pt-0 mx-6 pa-0">
                <v-card-title class="mt-12">{{selected_event.title}}</v-card-title>
                <v-spacer/>
                <v-icon style="height:80px;" @click="dialog=false, selected_event={}">mdi-close</v-icon>
            </v-row>
            <v-img class="mt-4 mb-8" :src="selected_event.featured_image"/>

            <v-row class="my-3 mx-10">
                <v-chip dark small :color="selected_event.activity_type.color" style="font-weight:500; border-radius:3px;">{{selected_event.activity_type.name}}</v-chip>
                <v-spacer/>
                <v-card-subtitle style="color:grey; font-weight:600;" class="ma-0 pa-0">{{selected_event.only_date}}</v-card-subtitle>
            </v-row>
            
            <div class="mx-10 pb-12" style="color:grey;">{{selected_event.description}} {{selected_event.description}}</div>
            
        </v-card>
    </v-dialog>
    </div>
    <div v-else style="text-align:center; filter:opacity(.5);" class="mt-12 pt-12">
        No hay eventos aún
        <br/>
        <br/>
        <span style="font-size:100px;">{{':('}}</span>
    </div>
    
  </v-container>
</template>

<script>
import axios from "axios"
export default {
    data(){
        return{
            loader:true,
            dialog:false,
            events:[],
            selected_event:{}
        }
    },
    methods:{
        openDetail(event){
            this.dialog = true
            this.selected_event = event
        }
    },
    created(){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/events').then(response=>{
            this.events = response.data.data
            this.loader = false
        })
    }
}
</script>

<style>

</style>