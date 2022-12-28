<template>
    <v-container style="max-width:100vw;" class="mb-6">
        <v-row class="ma-0 pa-0" >
            <v-card-title>Documentos</v-card-title>
        </v-row>
        <!--v-card v-for="(card, index) in cards" :key="index" class="py-4 px-6 mb-4 elevation-0">

            <v-list-item class="px-0">
                <v-avatar tile color="white">
                    <img style="height:30px; width:35px;" :src="card.avatar">
                </v-avatar>

                <v-card-title style="font-size:18px;">
                    {{card.title}}
                </v-card-title>

            </v-list-item>

            
        </v-card-->

        <div style="text-align:center; filter:opacity(.5);" class="mt-12 pt-12">
            No hay documentos aún
            <br/>
            <br/>
            <span style="font-size:100px;">{{':('}}</span>
        </div>
    </v-container>
</template>

<script>
export default {
    computed:{
        cards(){
            return [
                {title:'Documento de Prueba.pdf', link:'#', avatar:'https://www.gstatic.com/images/branding/product/2x/forms_2020q4_48dp.png'},
                {title:'Presenación de Prueba.pptx', link:'#', avatar:'https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png'},
                {title:'Documento de Prueba.doc', link:'#', avatar:'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png'},
                {title:'Tabla de Prueba.xls', link:'#', avatar:'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png'}
            ]
        }
    }
}
</script>

<style>

</style>