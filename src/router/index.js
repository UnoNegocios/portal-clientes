import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../components/Dashboard.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../components/sales/container.vue')
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('../components/payments/container.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../components/graphics/container.vue')
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../components/events/container.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../components/news/container.vue')
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('../components/documents/container.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
