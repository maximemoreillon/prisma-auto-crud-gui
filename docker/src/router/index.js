// Composables
import { createRouter, createWebHistory } from "vue-router";
import Restart from '@/views/Restart.vue'
const routes = [
  {
    path: "",
    name: "tables",
    redirect: "/tables",
  },
  {
    path: "/restart",
    name: "restart",
    component: Restart,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
