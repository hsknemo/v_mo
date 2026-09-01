import { createRouter, createWebHashHistory } from "vue-router";
import site from "@/config/site";

const routes = site.menus.map((m) => ({
  path: m.path,
  name: m.name,
  component: () => import(`@/views/${m.component}.vue`),
  meta: { title: m.label },
}));

routes.push({
  path: "/play/:type/:id",
  name: "play",
  component: () => import("@/views/PlayView.vue"),
  meta: { title: "播放" },
});

routes.push({
  path: "/",
  redirect: site.menus[0].path,
});

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 维默观影` : "维默观影";
});

export default router;
