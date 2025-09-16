import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Projects from '../views/Projects.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/projects', name: 'Projects', component: Projects },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
