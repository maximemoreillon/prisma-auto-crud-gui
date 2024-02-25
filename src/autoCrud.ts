import Tables from "./views/Tables.vue";
import Items from "./views/Items.vue";
import Item from "./views/Item.vue";

import axios from "axios";

interface Options {
  router: any;
  apiUrl: string;
}

export default {
  install: (app: any, options: Options) => {
    const { router, apiUrl } = options;

    axios.defaults.baseURL = apiUrl;

    const routes = [
      { name: "tables", path: "/tables", component: Tables },
      { name: "items", path: "/:table", component: Items },
      { name: "item", path: "/:table/:primaryKey", component: Item },
    ];

    routes.forEach(router.addRoute);
  },
};
