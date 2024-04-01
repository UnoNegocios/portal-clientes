import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Account from '../components/Account.vue'
import OrdersHistory from '../components/OrdersHistory.vue'
import ClientInfo from '../components/ClientInfo.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/orders-history',
    name: 'History',
    component: OrdersHistory
  },
  {
    path: '/client-info',
    name: 'Client Info',
    component: ClientInfo
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
