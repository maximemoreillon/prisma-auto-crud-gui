import App from "./App.vue";
import { createApp } from "vue";
import { registerPlugins } from "@/plugins";

const app = createApp(App);

// Prisma Auto CRUD is registered in there
registerPlugins(app);

app.mount("#app");
