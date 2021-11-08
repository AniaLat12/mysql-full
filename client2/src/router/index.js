import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home'
  },
  {
    path: '/about',
    name: 'About'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
