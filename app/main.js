import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { registerPlugins } from "./plugins";

import { init } from "../src/main";

const apiUrl = import.meta.env.VITE_API_URL;

init({ router, apiUrl });

const app = createApp(App);

registerPlugins(app);

app.use(router).mount("#app");
