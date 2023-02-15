import App from "./App.vue";
import { createApp } from "vue";
import { registerPlugins } from "@/plugins";

const app = createApp(App);

// Prisma Auto CRUD is registered in there
registerPlugins(app);

app.mount("#app");

// Loading vuetify in prisma auto crud
// working but a bad idea as this prevents configuration of vuetify
// import router from "./router";
// import prismaAutoCrudGui from "@moreillon/prisma-auto-crud-vuetify";
// import "@moreillon/prisma-auto-crud-vuetify/dist/style.css";
// const apiUrl = import.meta.env.VITE_API_URL;

// app.use(prismaAutoCrudGui, { router, apiUrl }).mount("#app");
