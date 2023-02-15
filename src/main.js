import Tables from "./views/Tables.vue";
import Items from "./views/Items.vue";
import Item from "./views/Item.vue";
import Test from "./views/Test.vue";

import axios from "axios";

export default {
  install: (app, options) => {
    console.log("Hello plugin");

    const { router, apiUrl } = options;

    axios.defaults.baseURL = apiUrl;

    const routes = [
      { name: "test", path: "/test", component: Test },

      { name: "tables", path: "/tables", component: Tables },
      { name: "items", path: "/:table/", component: Items },
      { name: "item", path: "/:table/:id", component: Item },
    ];

    routes.forEach(router.addRoute);
  },
};
