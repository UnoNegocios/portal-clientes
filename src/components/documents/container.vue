<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <v-row class="ma-0 pa-0" >
            <v-card-title>Documentos</v-card-title>
        </v-row>
        <v-card v-for="(card, index) in cards" :key="index" class="py-4 px-6 mb-4 elevation-0">

            <v-list-item class="px-0">
                <v-avatar tile color="white">
                    <img style="height:30px;" :src="card.avatar">
                </v-avatar>

                <v-card-title style="font-size:18px;">
                    {{card.title}}
                </v-card-title>

            </v-list-item>

            
        </v-card>
    </v-container>
</template>

<script>
export default {
    computed:{
        cards(){
            return [
                {title:'Documento Prueba.pdf', link:'#', avatar:'https://www.gstatic.com/images/branding/product/2x/forms_2020q4_48dp.png'},
                {title:'Presenación Prueba.pptx', link:'#', avatar:'https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png'},
                {title:'Documento Prueba.doc', link:'#', avatar:'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png'},
                {title:'Tabla Prueba.xls', link:'#', avatar:'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png'}
            ]
        }
    }
}
</script>

<style>

</style>