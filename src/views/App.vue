<template>
    <v-app class="pa-0">
        <v-main class="pa-0" style="background-color:#f4f5fa;">
            <v-container class="pa-0" fluid>
                    <transition name="fade" mode="out-in">
                        <router-view/>
                    </transition>
            </v-container>
        </v-main>
        <v-card class="menu-bottom px-4 py-0 pb-2">
            <v-row class="ma-0">
                <v-col cols="4">
                    <v-list-item to="/">
                        <v-spacer/>
                            <v-icon>mdi-view-dashboard</v-icon>
                        <v-spacer/>
                    </v-list-item>
                </v-col>
                <v-col cols="4">
                    <v-list-item to="/reports">
                        <v-spacer/>
                        <v-icon>mdi-chart-bar</v-icon>
                        <v-spacer/>
                    </v-list-item>
                </v-col>
                <v-col cols="4">
                    <v-list-item to="/events">
                        <v-spacer/>
                        <v-icon>mdi-calendar</v-icon>
                        <v-spacer/>
                    </v-list-item>
                </v-col>
            </v-row>
        </v-card>
    </v-app>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    created(){
        this.$store.dispatch('currentUser/getUser')
    },
}
</script>

<style>
.menu-bottom{
    position: fixed!important;
    bottom: 0!important;
    width: 100vw!important;
    border-radius: 20px 20px 0px 0px!important;
    box-shadow: 0px 10px 20px 10px #00000018!important;
}
.v-list-item.v-list-item--link.theme--light:hover i::before{
    color: #c57de4!important;
}
.v-list-item--active i::before{
    color: #c57de4!important;
}
.theme--light.v-list-item--active:hover::before, .theme--light.v-list-item--active::before{
    opacity: 0!important;
}
.fade-enter{
    transform: translateX(100vw);
}
.fade-leave-to {
    transform: translateX(-100vw);
}
.fade-enter-active, .fade-leave-active {
    transition: all .15s ease;
}
</style>