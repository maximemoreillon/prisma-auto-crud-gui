import { createRouter, createWebHistory } from "vue-router";

const routes = [{ path: "/", redirect: "/tables" }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
