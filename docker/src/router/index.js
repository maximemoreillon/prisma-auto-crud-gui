// Composables
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "",
    // name: "Tables",
    redirect: "/tables",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
