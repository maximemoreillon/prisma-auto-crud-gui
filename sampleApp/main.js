import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import { createApp } from "vue";
import { registerPlugins } from "./plugins";

import { init } from "../src/autoCrud";
init(router);

const app = createApp(App);

registerPlugins(app);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

app
  .use(router)
  .use(VueAxios, axios)
  .provide("axios", app.config.globalProperties.axios) // provide 'axios'
  .mount("#app");
