import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/about",
    name: "About",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  routes,
});

export default router;
