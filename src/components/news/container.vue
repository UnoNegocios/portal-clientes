<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <v-row class="ma-0 pa-0" >
            <v-spacer/>
            <v-card-title class="px-0">Noticias</v-card-title>
            <v-spacer/>
        </v-row>
        <v-row class="ma-0 pa-0" style="position:absolute!important; top:13px;">
            <v-btn class="mr-2 pt-7" to='/' icon><v-icon>mdi-chevron-left</v-icon></v-btn>
        </v-row>
        <div style="text-align:center; filter:opacity(.5);" class="mt-12 pt-12">
            No hay noticias aún
            <br/>
            <br/>
            <span style="font-size:100px;">{{':('}}</span>
        </div>
    </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>