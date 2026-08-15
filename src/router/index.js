import { createRouter, createWebHashHistory } from 'vue-router'
import site from '@/config/site'

const routes = site.menus.map((m) => ({
  path: m.path,
  name: m.name,
  component: () => import(`@/views/${m.component}.vue`),
  meta: { title: m.label }
}))

routes.push({
  path: '/',
  redirect: site.menus[0].path
})

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - v_movie` : 'v_movie'
})

export default router
